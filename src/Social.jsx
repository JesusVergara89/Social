import React from 'react'
import Register from './auth/Register'
import { auth } from './firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './auth/Login';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Verification from './components/Verification';

function Social() {
    const [currentlyLoggedinUser] = useAuthState(auth);
    let comments =
        [
            {
                main: 'this is the main comments',
                others: {
                    one: { content: 'this is the one', createdAt: 'date' },
                    two: { content: 'this is the second', createdAt: 'date' },
                    three: { content: 'this is the third', createdAt: 'date' },
                    four: { content: 'this is the four', createdAt: 'date' },
                    five: { content: 'this is the  five', createdAt: 'date' }
                },
                createdAt: 'date'
            }
        ]


    console.log(currentlyLoggedinUser, '########', 'MNwTGkdymYdby7R3zKFjr8Fsr6n2')
    return (
        <div className='SOCIAL'>


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

                <Route path='/verification'
                    element={
                        <Verification />
                    }
                />
            </Routes>
        </div>
    )
}

export default Social