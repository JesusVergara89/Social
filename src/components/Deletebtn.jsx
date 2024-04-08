import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebaseConfig'
import '../style/Deletebtn.css'

const Deletebtn = (idpost) => {
    const [currentoLogUser] = useAuthState(auth)
    return (
        <>
            {currentoLogUser.uid === idpost ?
                <div className="delete-btn">
                    <button><i className='bx bxs-x-circle'></i></button>
                </div>
                :
                ''
            }
        </>
    )
}

export default Deletebtn