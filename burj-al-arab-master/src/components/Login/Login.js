import React, { useContext, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase.configaration';

import { GoogleAuthProvider, getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { UserContext } from '../../App';
import { useNavigate, useLocation } from 'react-router-dom'


const app = initializeApp(firebaseConfig);

const Login = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [newUser, setNewUser] = useState(false);

    const [user, setUser] = useState({
        isUser: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: '',
        success: false,
    })

    let navigate = useNavigate();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const handleGoogleLogIn = () => {
        const GoogleProvider = new GoogleAuthProvider();

        const auth = getAuth();
        signInWithPopup(auth, GoogleProvider)
            .then((result) => {
                const { displayName, email } = result.user;
                const signInUser = {
                    name: displayName, email
                }
                setLoggedInUser(signInUser);
                setUserToken();





            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);

            });
    }
    const setUserToken = () => {
        getAuth().currentUser.getIdToken(/* forceRefresh */ true)
            .then(function (idToken) {

                sessionStorage.setItem('token', idToken);
                navigate(from);


            }).catch(function (error) {
                // Handle error
            });
    }


    const handleInput = (event) => {
        // console.log(event.target.name + event.target.value);

        let isValidInput = true;

        if (event.target.name === 'email') {
            isValidInput = /\S+@\S+\.\S+/.test(event.target.value);
        }
        if (event.target.name === 'password') {
            const checkNumber = /\d{1}/.test(event.target.value);
            const checkLength = event.target.value.length > 6;
            isValidInput = checkNumber && checkLength;
        }

        if (isValidInput) {
            const newUser = { ...user }
            newUser[event.target.name] = event.target.value;
            setUser(newUser);
        }
    }

    const userUpdate = name => {
        const auth = getAuth();
        updateProfile(auth.currentUser, {
            displayName: name,
        }).then(() => {
            console.log('Successfully Updated');
        }).catch((error) => {
            console.log('Successfully Updated Not');
        });
    }

    const handleSubmit = (e) => {
        if (newUser && user.email && user.password) {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                    const newUser = userCredential.user;
                    const createNewUser = { ...user }
                    createNewUser.success = true;
                    createNewUser.error = ''
                    setUser(createNewUser);
                    userUpdate(user.name);
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    const createNewUser = { ...user }
                    createNewUser.error = errorMessage
                    createNewUser.success = false;
                    setUser(createNewUser);
                });
        }

        if (!newUser && user.email && user.password) {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                    const createNewUser = { ...user }
                    createNewUser.success = true;
                    createNewUser.error = ''
                    setUser(createNewUser);
                    setLoggedInUser(createNewUser);
                    navigate(from);
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    const createNewUser = { ...user }
                    createNewUser.error = errorMessage
                    createNewUser.success = false;
                    setUser(createNewUser);
                });
        }
        e.preventDefault();
    }




    return (
        <div>
            <h1>This is Login</h1>
            <button onClick={handleGoogleLogIn}>Google Login</button>
            <h1>Authentication with Email </h1>

            <form onSubmit={handleSubmit} action="">
                <input onChange={() => { setNewUser(!newUser) }} type='checkbox' name='newUser' id='newUser' />
                <label htmlFor="newUser">New User Sign Up</label>
                {newUser && <input onBlur={handleInput} type="text" name="name" placeholder="Name" />}
                <br />
                <input onBlur={handleInput} type="email" name="email" placeholder="Email" required />
                <br />
                <input onBlur={handleInput} type="password" name="password" placeholder="Password" required />
                <br />
                <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />

            </form>

            <p style={{ 'color': 'red' }}>{user.error}</p>
            {
                user.success && <p style={{ 'color': 'green' }}>Successfully user {newUser ? 'Created' : 'Log in'} </p>
            }

        </div>
    );
};

export default Login;