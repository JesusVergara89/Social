import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { Navigate, Outlet } from 'react-router-dom';

const Protectedroutes = () => {
    const [currentlyLoggedinUser] = useAuthState(auth);

    if (currentlyLoggedinUser) {
        return <Outlet />;
    } else {
        return <Navigate to='/login' />;
    }
}

export default Protectedroutes