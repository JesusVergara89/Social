import React, { useEffect, useState } from 'react'
import Register from './auth/Register'
import Login from './auth/Login';
import { Route, Routes } from 'react-router-dom';
import Profile from './components/Profile';
import Protectedroutes from './components/Protectedroutes';
import Header from './components/Header';
import Createpost from './components/Createpost';
import Post from './components/Post';
import Sendmessage from './components/messages/Sendmessage';

function Social() {



    return (
        <div className='SOCIAL'>

            <Header />

            <Routes>

                <Route path='/'
                    element={
                        <Post />
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
                    <Route path='/send'
                        element={
                            <Sendmessage />
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