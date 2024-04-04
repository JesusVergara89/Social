import React, { useEffect, useState } from 'react';
import '../style/Conections.css';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const Conections = () => {
    const [allrequest, setAllrequest] = useState([]);
    const [myConections, setMyConections] = useState([]);
    const [usersall, setUsersall] = useState([]);
    const [userlog] = useAuthState(auth);

    useEffect(() => {
        const reqRef = collection(db, 'Users');
        const q = query(reqRef, orderBy('userName'));
        onSnapshot(q, (snapshot) => {
            const reqData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllrequest(reqData);
        });

        const userRef = collection(db, 'Request');
        const q1 = query(userRef, orderBy('friendRequests'));
        onSnapshot(q1, (snapshot) => {
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsersall(userData);
        });
    }, []);


    return (
        <div className="connections">
            hello
        </div>
    );
};

export default Conections;
