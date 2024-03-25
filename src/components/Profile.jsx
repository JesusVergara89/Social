import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import '../style/Profile.css'

const Profile = () => {
    const [currentlyLoggedinUser] = useAuthState(auth);
    const [users, setUsers] = useState([]);
    const [currentUserData, setCurrentUserData] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersCollectionRef = collection(db, 'Users');
                const usersSnapshot = await getDocs(usersCollectionRef);
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        getUsers();
    }, []);

    useEffect(() => {
        if (currentlyLoggedinUser) {
            const currentUser = users.find(user => user.idUser === currentlyLoggedinUser.uid);
            setCurrentUserData(currentUser);
        }
    }, [currentlyLoggedinUser, users]);

    return (
        <div className='profile'>
            {currentUserData && currentlyLoggedinUser && (
                <div className='profile-information'>
                    <div className="profile-information-image">
                        <img src={currentlyLoggedinUser.photoURL} alt="" />
                    </div>
                    <div className="profile-information-data">
                        <h2 className="profile-information-userid">{`@${currentUserData.userName}`}</h2>
                        <h3 className="profile-information-name">{currentlyLoggedinUser.displayName}</h3>
                        <p className="profile-information-bio">{currentUserData.bio}</p>
                    </div>
                    <button onClick={() => { signOut(auth); navigate('/'); }}>Salir</button>
                </div>
            )}
            <div className="other">this is other dic</div>
        </div>
    );
};

export default Profile