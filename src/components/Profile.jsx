import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import '../style/Profile.css'
import Mypost from './Mypost';
import Displaycounters from '../counters/Displaycounters';
import { useDispatch, useSelector } from 'react-redux';
import { setRequestValue } from '../store/slices/request.slice';
import { setConectionValue } from '../store/slices/conections.slice';
import { setMsgValue } from '../store/slices/countermsg.slice';
const Profile = () => {
    const [currentlyLoggedinUser] = useAuthState(auth);
    const [users, setUsers] = useState([]);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [numberOf, setNumberOf] = useState(0);
    const dispatch = useDispatch();
    const CounterNotifyRequests = useSelector(state => state.request);
    const setFriendValue = (value) => dispatch(setConectionValue(value));
    const setMesgValue = (value) => dispatch(setMsgValue(value));
    const navigate = useNavigate()
    const createPost = useNavigate()

    useEffect(() => {
        const usersCollectionRef = collection(db, 'Users');
        const q = query(usersCollectionRef, orderBy('userName'))
        onSnapshot(q, (snapshot) => {
            const userInfo = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setUsers(userInfo);
        })
    }, [currentlyLoggedinUser]);

    useEffect(() => {
        if (currentlyLoggedinUser) {
            const currentUser = users.find(user => user.idUser === currentlyLoggedinUser.uid);
            setCurrentUserData(currentUser);
        }
    }, [currentlyLoggedinUser, users]);

    const setSpecific = () => dispatch(setRequestValue(numberOf));
    
    return (
        <div className='profile'>
            {currentUserData && currentlyLoggedinUser && (
                <div className='profile-information'>
                    <div className='Configprofile'>
                        <Link to={`/configprofile/${currentUserData?.id}`}>
                            <i className='bx bx-cog'></i>
                        </Link>
                    </div>
                    <div className="profile-information-image">
                        <img src={currentlyLoggedinUser.photoURL} alt="" />
                    </div>
                    <div className="profile-information-data">
                        <h2 className="profile-information-userid">{`@${currentUserData.userName}`}</h2>
                        <h3 className="profile-information-name">{currentlyLoggedinUser.displayName}</h3>
                        <p className="profile-information-bio">{currentUserData.bio}</p>
                    </div>
                    <button onClick={() => { signOut(auth); navigate('/'); setSpecific(setNumberOf(0)); setFriendValue(0); setMesgValue(0) }}>Salir</button>
                    <Link className='pending-request-btn' to={'/pendingrequest'}>
                        <h3>Solicitudes</h3>
                        <div className='CounterNotifyRequests' ><h5>{CounterNotifyRequests}</h5></div>
                        <div className='CounterNotifyRequests-1' ></div>
                    </Link>
                </div>
            )}
            <div className="profile-counters">
                <Displaycounters />
            </div>
            <div className="profile-post">
                <Mypost />
            </div>
        </div>
    );
};

export default Profile