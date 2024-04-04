import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { auth, db } from '../firebaseConfig';
import { setRequestValue } from '../store/slices/request.slice';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const Invisiblecomp = () => {
    const dispatch = useDispatch();
    const [allusers, setAllusers] = useState([]);
    const [pending, setPending] = useState([]);
    const [myPending, setMyPending] = useState([]);
    const [user] = useAuthState(auth);

    const setSpecific = (value) => dispatch(setRequestValue(value));

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Request'), (snapshot) => {
            const requests = snapshot.docs.map((doc) => {
                const { createdAt, ...dataWithoutCreatedAt } = doc.data();
                return { id: doc.id, ...dataWithoutCreatedAt };
            });
            setPending(requests);
        });

        const userRef = collection(db, 'Users');
        const q = query(userRef, orderBy('userName'));
        const unsubscribeUsers = onSnapshot(q, (snapshot) => {
            const userx = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllusers(userx);
        });

        return () => {
            unsubscribe();
            unsubscribeUsers();
        };
    }, []);

    useEffect(() => {
        if (pending.length > 0 && user) {
            const userPending = pending.filter(pen =>
                pen.friendRequests.some(data => data.id1 === user.uid || data.id2 === user.uid)
            );
            setMyPending(userPending.length > 0 ? userPending : []);
        }
    }, [pending, user]);

    useEffect(() => {
        const friendshipStatus = myPending.map(pendingItem => ({
            id: pendingItem.id,
            status1: pendingItem.friendRequests[0]?.status,
            status2: pendingItem.friendRequests[1]?.status
        }));

        const acceptedRequests = friendshipStatus.filter(data => data.status1 === null && data.status2 === true);
        setSpecific(acceptedRequests.length);
    }, [myPending]);

    return (
        <div style={{ position: 'absolute', top: '-550px' }}>Invisiblecomp</div>
    );
};

export default Invisiblecomp;
