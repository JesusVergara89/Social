import React, { useState } from 'react'
import Register from './auth/Register'
import Login from './auth/Login';
import { Route, Routes } from 'react-router-dom';
import Profile from './components/Profile';
import Protectedroutes from './components/Protectedroutes';
import Header from './components/Header';
import Createpost from './components/Createpost';
import Post from './components/Post';
import Sendmessage from './components/messages/Sendmessage';
import Friendrequest from './components/messages/Friendrequest';
import Allusers from './components/messages/Allusers';
import Pendingfriendrequests from './components/messages/Pendingfriendrequests';

function Social() {

    const [newuser, setNewuser] = useState({})

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
                        <Register setNewuser={setNewuser} />
                    }
                />

                <Route path='/login'
                    element={
                        <Login />
                    }
                />

                <Route path='/allusers'
                    element={
                        <Allusers />
                    }
                />

                <Route element={<Protectedroutes />}>
                    <Route path='/profile'
                        element={
                            <Profile setNewuser={setNewuser} newuser={newuser} />
                        }
                    />
                    <Route path='/Sendmessage'
                        element={
                            <Sendmessage />
                        }
                    />
                    <Route path='/pendingrequest'
                        element={
                            <Pendingfriendrequests />
                        }
                    />
                    <Route path='/friendrequest/:id'
                        element={
                            <Friendrequest />
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