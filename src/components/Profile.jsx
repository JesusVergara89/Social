import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import '../style/Profile.css'
///import { toast } from 'react-toastify';

const Profile = ({ newuser, setNewuser }) => {
    const [currentlyLoggedinUser] = useAuthState(auth);
    const [users, setUsers] = useState([]);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [executedOnce, setExecutedOnce] = useState(false);

    const navigate = useNavigate()

    const addUserToDatabase = async () => {
        try {
            const articleRef = collection(db, 'Users');
            await addDoc(articleRef, {
                age: newuser.age,
                bio: newuser.bio,
                idUser: currentlyLoggedinUser.uid,
                userName: newuser.userName,
                photo: currentlyLoggedinUser.photoURL,
                name: newuser.name
            });
            //toast('Bio added successfully', { type: 'success' });
            setNewuser({})
        } catch (error) {
            //console.log(error)
            //toast('Error adding bio', { type: 'error' });
            setNewuser({})
        }
    };

    useEffect(() => {
        if (!executedOnce) {
            const timer = setTimeout(() => {
                addUserToDatabase();
                console.log('La función se ejecutó después de un segundo del primer renderizado.');
                setExecutedOnce(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [executedOnce]);

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
    }, [currentlyLoggedinUser, setNewuser]);

    useEffect(() => {
        if (currentlyLoggedinUser) {
            const currentUser = users.find(user => user.idUser === currentlyLoggedinUser.uid);
            setCurrentUserData(currentUser);
        }
    }, [currentlyLoggedinUser, users]);

    //console.log(currentUserData)
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
            <Link className='pending-request-btn' to={'/pendingrequest'}>
                <h3>Pending requests</h3>
            </Link>
        </div>
    );
};

export default Profile