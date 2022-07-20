const port = 5000
const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const admin = require("firebase-admin");
const { getAuth } = require('firebase-admin/auth');

require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvqwp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const serviceAccount = require("./component/burj-al-arab-project-7abff-firebase-adminsdk-24laz-3bd62dfb13.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

client.connect(err => {
    const bookings = client.db("burjAlArab").collection("bookings");
    console.log('connection successful');

    //POST
    app.post('/add-booking', (req, res) => {
        const newBooking = req.body
        console.log(newBooking)
        bookings.insertOne(newBooking)
            .then(result => {
                console.log(result)
                res.send(result.acknowledged)
            })
    });


    //GET READ
    app.get('/bookings', (req, res) => {
        // console.log('token', req.headers.authorization);

        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1]
            // console.log({idToken})
            getAuth()
                .verifyIdToken(idToken)
                .then((decodedToken) => {
                    const tokenEmail = decodedToken.email;
                    // console.log(tokenEmail, req.query.email)
                    if (tokenEmail == req.query.email) {
                        bookings.find({ email: req.query.email })
                            .toArray((err, documents) => {
                                res.send(documents)
                            })
                    }
                    else {
                        res.status(401).send('un-authorized Access')

                    }
                })
                .catch((error) => {
                    res.status(401).send('un-authorized Access')

                });
        }
        else {
            res.status(401).send('un-authorized Access')
        }

    })
});

//PORT LISTENER
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})