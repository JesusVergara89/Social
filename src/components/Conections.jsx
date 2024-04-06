import useConnections from '../hooks/useConnections';
import Contactutility from './messages/Contactutility';
import { Link } from 'react-router-dom';
import '../style/Conections.css'

const Conections = () => {

    const { counterPost, counterConnectios, findFriends, userlog, allpost, allrequest,usersall } = useConnections()
    
    return (
        <div className="connections">
            {findFriends &&
                (
                    findFriends.map((user, i) => (
                        <div key={i} className="all-users-mapeo">
                            <div className='all-users-profile-information-connection'>
                                <div className="all-users-profile-information-image">
                                    <img src={user.photo} alt="" className="all-users-profile-image" />
                                </div>
                                <div className="all-users-profile-information-data">
                                    <h2 className="all-users-userid">{`@${user.userName}`}</h2>
                                    <h3 className="all-users-name">{user.name}</h3>
                                    <p className="all-users-bio">{user.bio}</p>
                                </div>
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
                                <Link className='all-users-other-profile' to={`/singleprofile/${user.id}/${counterConnectios(allrequest, user.idUser)}/${counterPost(allpost, user.idUser)}`} >
                                    Ver perfil
                                </Link>
                            </div>
                            <Contactutility idCurrentUser={userlog?.uid} idUSER={user.idUser} />
                        </div>
                    ))
                )
            }
        </div>
    );
};

export default Conections;
