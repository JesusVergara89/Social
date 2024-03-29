import React from 'react'
import './Contactutility.css'
import { Link } from 'react-router-dom'

const Contactutility = ({idUSER}) => {
    return (
        <div className="profile-utilyties">
            <div className="profile-message">
                <i className='bx bx-message-detail'></i>
            </div>
            <div className="profile-message">
                <Link to={`/friendrequest/${idUSER}`}>
                    <i className='bx bxs-user-plus'></i>
                </Link>
            </div>
        </div>
    )
}

export default Contactutility