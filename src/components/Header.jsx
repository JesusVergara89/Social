import React from 'react'
import '../style/Header.css'
import social from '../images/Social.svg'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'

const Header = () => {
    const [currentlyLoggedinUser] = useAuthState(auth);
    const navigate = useNavigate()
    return (
        <header>
            <div onClick={() => navigate('/')} className="logo">
                <img src={social} alt="" />
            </div>
            <div className="menu">
               {
                
               }
            </div>
        </header>
    )
}

export default Header