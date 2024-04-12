import '../style/Header.css'
import social from '../images/Social.svg'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import nullphoto from '../images/nullprofile.svg'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

const Header = () => {
    
    const [currentlyLoggedinUser] = useAuthState(auth);
    const navigate = useNavigate()
    const conexionNumber = useSelector(state => state.conectionNumber)
    const [allusers, setAllusers] = useState()
    const reloadPhoto = useSelector(state => state.photoUpdate);

    useEffect(()=>{
        const usersCollectionRef = collection(db, 'Users');
        const q = query(usersCollectionRef, orderBy('userName'))
        onSnapshot(q, (snapshot) => {
            const allUsers = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAllusers(allUsers);
        })
    },[reloadPhoto])
    
    //console.log(allusers)

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