
import React, { useContext, useState } from 'react';

import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../../App';

import 'date-fns';

import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';

import Button from '@material-ui/core/Button';
import {
    MuiPickersUtilsProvider,

    KeyboardDatePicker,
} from '@material-ui/pickers';
import Bookings from '../Bookings/Bookings';


const Book = () => {
    const { bedType } = useParams();
    const [loggedInUser] = useContext(UserContext);


    const [selectedDate, setSelectedDate] = useState({
        checkIn: new Date(),
        checkOut: new Date()
    });

    const handleCheckInDate = (date) => {
        let newDate = { ...selectedDate }
        newDate.checkIn = date
        setSelectedDate(newDate);
    };
    const handleCheckOutDate = (date) => {
        let newDate = { ...selectedDate }
        newDate.checkOut = date
        setSelectedDate(newDate);
    };

    const handleBooking = () => {
        const newBooking = { ...loggedInUser, ...selectedDate }
        fetch('http://localhost:5000/add-booking', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(newBooking)
        }).then(res => res.json)
            .then(data => {
                console.log(data);
            })

    }


    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Hey: {loggedInUser.name}  Let's book a {bedType} Room.</h1>
            <p>Want a <Link to="/home">different room?</Link> </p>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={selectedDate.checkIn}
                        onChange={handleCheckInDate}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Date picker dialog"
                        format="dd/MM/yyyy"
                        value={selectedDate.checkOut}
                        onChange={handleCheckOutDate}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />

                </Grid>

                <Button onClick={handleBooking} variant="contained" color="primary">
                    Book Now
                </Button>
            </MuiPickersUtilsProvider>

            <Bookings ></Bookings>
        </div>
    );
};

export default Book;