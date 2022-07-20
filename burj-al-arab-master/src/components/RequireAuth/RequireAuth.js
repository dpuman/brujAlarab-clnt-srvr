import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../App'

const RequireAuth = ({ children }) => {

    let [loggedInUser, setLoggedInUser] = useContext(UserContext)
    let location = useLocation()

    if (!loggedInUser.email) {
        return <Navigate to='/login' state={{ from: location }} replace></Navigate>
    }
    return children;
};

export default RequireAuth;