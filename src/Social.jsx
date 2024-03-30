import React, { useState } from 'react'
import Register from './auth/Register'
import Login from './auth/Login';
import { Route, Routes } from 'react-router-dom';
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
import Messagescontainer from './components/messages/Messagescontainer';

function Social() {

    const [newuser, setNewuser] = useState({})

    const functionalData = 'hello'

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
                    <Route path='/singlesuser/:iduser'
                        element={
                            <Singleuser />
                        }
                    />
                    <Route path='/messagesinbox/'
                        element={
                            <Messagescontainer idreceiper={functionalData} />
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