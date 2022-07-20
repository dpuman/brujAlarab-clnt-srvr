import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loggedInUser, setLoggedInUser] = useContext(UserContext)

    useEffect(() => {
        fetch('http://localhost:5000/bookings?email=' + loggedInUser.email, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => setBookings(data))
    }, [])
    return (
        <div>
            <h3>You have total {bookings.length} bookings</h3>
            {
                bookings.map(booking => <li key={booking._id} >{booking.name} from: {(new Date(booking.checkIn).toDateString('dd/MM/yyyy'))} to: {(new Date(booking.checkOut).toDateString('dd/MM/yyyy'))}</li>)
            }

        </div>
    );
};

export default Bookings;