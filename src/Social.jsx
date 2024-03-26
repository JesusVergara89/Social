import React, { useEffect, useState } from 'react'
import Register from './auth/Register'
import { auth } from './firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './auth/Login';
import { Route, Routes } from 'react-router-dom';
import Profile from './components/Profile';
import Protectedroutes from './components/Protectedroutes';
import Header from './components/Header';
import Createpost from './components/Createpost';
import Post from './components/Post';

function Social() {

    const [currentlyLoggedinUser] = useAuthState(auth);

    const reloadPageSmoothly = () => {
        // Agregar clase para desvanecer la página
        console.log('hello')

        // Esperar un breve período de tiempo antes de re // Tiempo que coincide con la duración de la transición CSS
    };

    return (
        <div className='SOCIAL'>

            <Header />

            <Routes>

                <Route path='/'
                    element={
                        <Post reloadPage={reloadPageSmoothly} />
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
                    <Route path='/createpost'
                        element={
                            <Createpost />
                        }
                    />
                </Route>
            </Routes>
        </div>
    )
}

export default Social