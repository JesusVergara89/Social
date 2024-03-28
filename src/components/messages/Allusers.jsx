import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const Allusers = () => {

    const [Allusers, setAllusers] = useState([])
    const [user] = useAuthState(auth)

    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersCollectionRef = collection(db, 'Users');
                const usersSnapshot = await getDocs(usersCollectionRef);
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllusers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        getUsers();
    }, []);
    console.log(Allusers)
    return (
        <div className="all-users">
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            all user
        </div>
    )
}

export default Allusers