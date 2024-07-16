import React, { useEffect, useState } from 'react'
import '../style/Filtereduser.css'
import Contactutility from './messages/Contactutility'
import { Link } from 'react-router-dom'

const Filtereduser = ({ thiIsTheCurrentUser, usuario, filtro }) => {
    const [mostText, setmostText] = useState(false)
    const TruncaText = (text, maxlength) => {
        if (text?.length > maxlength) {
            return !mostText ?
                <p>
                    {text.substring(0, maxlength) + "..."}
                    <button onClick={() => setmostText(prev => !prev)}>Ver mas</button>
                </p> :
                <p>
                    {text}
                </p>
        } else {
            return text;
        }
    }
    useEffect(() => {
        setmostText(false)
    }, [usuario, filtro])

    return (
        <>
            {!(thiIsTheCurrentUser?.uid === usuario.idUser) &&
                <div className="all-users-mapeo-1">
                    <div className='all-users-profile-information-1'>
                        <Link className='all-users-other-profile-find-1' to={`/singleprofile/${usuario.id}`} >
                            Ver perfil
                        </Link>
                        <div className="all-users-profile-information-image-1">
                            <img src={usuario.photo} alt="" className="all-users-profile-image-1" />
                        </div>
                        <div className="all-users-profile-information-data-1">
                            <h2 className="all-users-userid-1">{`@${usuario.userName}`}</h2>
                            <h3 className="all-users-name-1">{usuario.name}</h3>
                            <div className="all-users-bio-1">{TruncaText(usuario.bio, 180)}</div>
                        </div>
                    </div>
                    <Contactutility idCurrentUser={thiIsTheCurrentUser?.uid} idUSER={usuario.idUser} />
                </div>
            }
        </>
    )
}

export default Filtereduser