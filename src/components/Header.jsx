import '../style/Header.css'
import social from '../images/Social.svg'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import nullphoto from '../images/nullprofile.svg'
import { useSelector } from 'react-redux'

const Header = () => {

    const [currentlyLoggedinUser] = useAuthState(auth);
    const navigate = useNavigate()
    const conexionNumber = useSelector(state => state.conectionNumber)
    const msgNotification = useSelector(state => state.countermsg);

  
    return (
        <header>
            <div onClick={() => navigate('/')} className="logo">
                <img src={social} alt="" />
            </div>
            <div className="menu">
                <Link to={'/allusers'}>
                    <div className="menu-alluser">
                        <i className='bx bxs-grid'></i>
                    </div>
                </Link>
                <Link to={'/messagesinbox'}>
                    <div className="menu-menu">
                        <i className='bx bx-message-detail'></i>
                        <div className={msgNotification === 1 ? 'menu-menu-notify' : 'menu-menu-notify-none'}>
                            <i className='bx bxs-bell-ring'></i>
                        </div>
                    </div>
                </Link>
                <Link to={'/conections'} >
                    <div className="menu-menu">
                        <i className='bx bx-group'></i>
                        <div className={conexionNumber <= 10 ? "conection-counter" : "conection-counter-grosse"}>
                            <h6>{conexionNumber}</h6>
                        </div>
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