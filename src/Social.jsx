import React, { useEffect, useState } from 'react'
import Register from './auth/Register'
import Login from './auth/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import Profile from './components/Profile';
import Protectedroutes from './components/Protectedroutes';
import Header from './components/Header';
import Createpost from './components/Createpost';
import Post from './components/Post';
import Friendrequest from './components/messages/Friendrequest';
import Allusers from './components/messages/Allusers';
import Pendingfriendrequests from './components/messages/Pendingfriendrequests';
import Messageinbox from './components/messages/Messageinbox';
import Singleuser from './components/Singleuser';
import Allmessageswithuser from './components/messages/Allmessageswithuser';
import Singlepost from './components/Singlepost';
import Invisiblecomp from './components/Invisiblecomp';
import Conections from './components/Conections';
import Singleprofile from './components/Singleprofile';
import Configprofile from './components/configurationprofile/Configprofile';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';

function Social() {    
    const [onlineuser] = useAuthState(auth)
    const [newuser, setNewuser] = useState({})
    return (
        <div className='SOCIAL'>

            <Header />

            <Invisiblecomp /> {/** In this component i rendered all the counter values for notifications */}

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
                    element={onlineuser ? <Navigate to="/" /> : <Login />}
                />

                <Route path='/allusers'
                    element={
                        <Allusers
                        />}
                />

                <Route element={<Protectedroutes />}>
                    <Route path='/profile'
                        element={
                            <Profile setNewuser={setNewuser} newuser={newuser} />
                        }
                    />
                    <Route path='/singlesuser/:iduser'
                        element={
                            <Singleuser />
                        }
                    />
                    <Route path='/singleprofile/:userProfile'
                        element={
                            <Singleprofile />
                        }
                    />
                    <Route path='/conections'
                        element={
                            <Conections />
                        }
                    />
                    <Route path='/messagesinbox'
                        element={
                            <Allmessageswithuser />
                        }
                    />
                    <Route path='/Sendmessage/:x1/:x2'
                        element={
                            <Messageinbox />
                        }
                    />
                    <Route path='/pendingrequest'
                        element={
                            <Pendingfriendrequests />
                        }
                    />
                    <Route path='/singlepost/:post'
                        element={
                            <Singlepost />
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
                    <Route path='/configprofile/:toConfig'
                        element={
                            <Configprofile />
                        }
                    />
                </Route>
            </Routes>
        </div>
    )
}

export default Social