import React from 'react'
import '../style/Filtereduser.css'
import Contactutility from './messages/Contactutility'
import { Link } from 'react-router-dom'
import useConnections from '../hooks/useConnections'

const Filtereduser = ({ thiIsTheCurrentUser, usuario }) => {
    const { counterPost, counterConnectios, allpost, allrequest } = useConnections()
    return (
        <div className="all-users-mapeo-1">
            <div className='all-users-profile-information-1'>
                <Link className='all-users-other-profile-find' to={`/singleprofile/${usuario.id}/${counterConnectios(allrequest, usuario.idUser)}/${counterPost(allpost, usuario.idUser)}`} >
                    Ver perfil
                </Link>
                <div className="all-users-profile-information-image-1">
                    <img src={usuario.photo} alt="" className="all-users-profile-image-1" />
                </div>
                <div className="all-users-profile-information-data-1">
                    <h2 className="all-users-userid-1">{`@${usuario.userName}`}</h2>
                    <h3 className="all-users-name-1">{usuario.name}</h3>
                    <p className="all-users-bio-1">{usuario.bio}</p>
                </div>
            </div>
            {thiIsTheCurrentUser?.uid === usuario.idUser ?
                ''
                :
                <Contactutility idCurrentUser={thiIsTheCurrentUser?.uid} idUSER={usuario.idUser} />
            }
        </div>
    )
}

export default Filtereduser