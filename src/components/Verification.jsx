import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
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

    console.log(currentUserData);

    return (
        <div>
            {currentUserData && (
                <div>
                    <img src={currentlyLoggedinUser.photoURL} alt="" />
                    <p>Name: {currentlyLoggedinUser.displayName}</p>
                    <p>Email: {currentlyLoggedinUser.email}</p>
                    <p>Age: {currentUserData.age}</p>
                    <p>Bio: {currentUserData.bio}</p>
                    <button onClick={() => { signOut(auth); navigate('/'); }}>Salir</button>
                </div>
            )}
        </div>
    );
};

export default Verification;
