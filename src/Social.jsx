import React from 'react'
import Register from './auth/Register'
import { auth } from './firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './auth/Login';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Protectedroutes from './components/Protectedroutes';
import Header from './components/Header';

function Social() {
    const [currentlyLoggedinUser] = useAuthState(auth);

    return (
        <div className='SOCIAL'>

            <Header/>

            <Routes>
                <Route path='/'
                    element={
                        <Home />
                    }
                />

                <Route path='/register'
                    element={
                        <Register />
                    }
                />

                <Route path='/login'
                    element={
                        <Login />
                    }
                />

                <Route element={<Protectedroutes />}>
                    <Route path='/profile'
                        element={
                            <Profile />
                        }
                    />
                </Route>
            </Routes>
        </div>
    )
}

export default Social