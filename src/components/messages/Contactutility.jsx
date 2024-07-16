import React from 'react'
import './Contactutility.css'
import { Link } from 'react-router-dom'

const Contactutility = ({ idUSER, idCurrentUser }) => {
    return (
        <div className="profile-utilyties">
                <Link to={`/Sendmessage/${idUSER}/${idCurrentUser}`} className="profile-message">
                    <i className='bx bx-message-detail'></i>
                </Link>
                <Link to={`/friendrequest/${idUSER}`} className="profile-message">
                    <i className='bx bxs-user-plus'></i>
                </Link>
        </div>
    )
}

export default Contactutility