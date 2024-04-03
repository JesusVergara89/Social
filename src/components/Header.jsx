import React, { useState } from 'react'
import '../style/Header.css'
import social from '../images/Social.svg'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import nullphoto from '../images/nullprofile.svg'
import moon from '../images/moon.svg'

const Header = () => {
    const [currentlyLoggedinUser] = useAuthState(auth);
    const navigate = useNavigate()
    const [isRunning, setIsRunning] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleButtonClick = () => {
        setIsRunning(!isRunning);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode', darkMode);
    };
    return (
        <header>
            <div onClick={() => navigate('/')} className="logo">
                <img src={social} alt="" />
                <div className='btn-mode' onClick={() => { handleButtonClick(); toggleDarkMode() }}>
                    <div className={`btn-mode-circle ${isRunning ? 'run' : ''}`}></div>
                    <img className={isRunning ? 'run' : ''} src={moon} alt="" />
                </div>
            </div>
            <div className="menu">
                <Link to={'/allusers'}>
                    <div className="menu-alluser">
                        <i className='bx bxs-grid'></i>
                        <h5>All users</h5>
                    </div>
                </Link>
                <Link to={'/messagesinbox'}>
                    <div className="menu-menu">
                        <i className='bx bx-message-detail'></i>
                        <h5>Messages</h5>
                    </div>
                </Link>
                <Link to={'/profile'}>
                    <div className="menu-profile">
                        <img src={currentlyLoggedinUser === null ? nullphoto : currentlyLoggedinUser?.photoURL} alt="" />
                        <h5>{currentlyLoggedinUser === null ? 'Inicia sesión' : currentlyLoggedinUser?.displayName}</h5>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default Header