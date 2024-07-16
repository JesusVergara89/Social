import React, { useEffect, useState } from 'react'
import './Messageinbox.css'
import { Link, useParams } from 'react-router-dom'
import { auth } from '../../firebaseConfig'
import Cardmsg from './Chat/Cardmsg'
import { useAuthState } from 'react-firebase-hooks/auth'
import Singlemessage from './Singlemessage'
import useConnections from '../../hooks/useConnections'

const Messageinbox = () => {

    const [thisUser] = useAuthState(auth)
    const { friend } = useParams()
    const { findFriends } = useConnections()
    const [allowMessages, setAllowMessages] = useState(false)

    useEffect(() => {
        setAllowMessages(findFriends.some(data => data.idUser === friend))
    }, [friend, findFriends]);
    return (
        <div className='Messageinbox'>
            <Cardmsg idreceiper={friend} />
            <div className="Messageinbox-container">
                {allowMessages ?
                    <Singlemessage idreceiper={friend} />
                    :
                    <div className='Messageinbox-request-friend' >
                        <h5>Aun no puedes enviarle mensajes a esta persona</h5>
                        <h5>Enviale una solicitud de amistad</h5>
                        <Link to={`/singlesuser/${friend}`}>
                            <i className='bx bxs-user-plus'></i>
                        </Link>
                    </div>
                }
            </div>
        </div>
    )
}

export default Messageinbox