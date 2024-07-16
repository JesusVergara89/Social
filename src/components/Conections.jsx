import useConnections from '../hooks/useConnections';
import Contactutility from './messages/Contactutility';
import { Link } from 'react-router-dom';
import '../style/Conections.css'
import { useState } from 'react';

const Conections = () => {
    const [mostText, setmostText] = useState(false)
    const { counterPost, counterConnectios, findFriends, allpost, allrequest } = useConnections()

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
    return (
        <div className="connections">
            <h4>Lista de amigos</h4>
            {findFriends &&
                (
                    findFriends.map((user, i) => (
                        <div key={i} className="all-users-mapeo">
                            <div className='all-users-profile-information-connection-main'>
                                <div className='all-users-profile-information-connection'>
                                    <img src={user.photo} alt="" className="all-users-profile-image" />
                                    <div className="all-users-profile-information-data">
                                        <h2 className="all-users-userid">{`@${user.userName}`}</h2>
                                        <h3 className="all-users-name">{user.name}</h3>
                                    </div>
                                    <Link className='all-users-other-profile' to={`/singleprofile/${user.id}`} >
                                        Ver perfil
                                    </Link>
                                </div>
                                <div className="all-users-bio">{TruncaText(user.bio, 180)}</div>
                                <div className='all-user-connections'>
                                    <div className="all-user-connections-counters">
                                        <h6><span>{counterConnectios(allrequest, user.idUser)}</span></h6>
                                        <h6>{counterConnectios(allrequest, user.idUser) > 1 ? `Conexiones` : `Conexión`}</h6>
                                    </div>
                                    <div className="all-user-connections-counters">
                                        <h6><span>{counterPost(allpost, user.idUser)}</span></h6>
                                        <h6>{counterPost(allpost, user.idUser) > 1 ? `Publicaciones` : `Publicación`}</h6>
                                    </div>
                                </div>
                            </div>
                            <Contactutility idUSER={user.idUser} />
                        </div>
                    ))
                )
            }
        </div>
    );
};

export default Conections;
