import React from 'react'
import '../style/Header.css'
import social from '../images/Social.svg'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import nullphoto from '../images/nullprofile.svg'

const Header = () => {
    const [currentlyLoggedinUser] = useAuthState(auth);
    const navigate = useNavigate()
    return (
        <header>
            <div onClick={() => navigate('/')} className="logo">
                <img src={social} alt="" />
            </div>
            <div className="menu">
                <Link to={'/allusers'}>
                    <div className="menu-alluser">
                        <i className='bx bxs-grid'></i>
                        <h5>All users</h5>
                    </div>
                </Link>
                <Link to={'/Sendmessage'}>
                    <div className="menu-menu">
                        <i className='bx bx-message-detail'></i>
                        <h5>Messages</h5>
                    </div>
                </Link>
                <Link to={'/profile'}>
                    <div className="menu-profile">
                        <img src={ currentlyLoggedinUser === null ?  nullphoto  : currentlyLoggedinUser?.photoURL} alt="" />
                        <h5>{ currentlyLoggedinUser === null ? 'Inicia sesión' : currentlyLoggedinUser?.displayName}</h5>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default Header