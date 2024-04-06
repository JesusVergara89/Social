import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { auth, db } from '../firebaseConfig';
import { setRequestValue } from '../store/slices/request.slice';
import { setConectionValue } from '../store/slices/conections.slice';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const useInvisible = () => {

    const dispatch = useDispatch();
    const [pending, setPending] = useState([]);
    const [myPending, setMyPending] = useState([]);
    const [friends, setFriends] = useState([]);
    const [matchFriends, setMatchFriends] = useState([]);
    const [user] = useAuthState(auth);

    const setSpecific = (value) => dispatch(setRequestValue(value));
    const setFriendValue = (value) => dispatch(setConectionValue(value));

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Request'), (snapshot) => {
            const requests = snapshot.docs.map((doc) => {
                const { createdAt, ...dataWithoutCreatedAt } = doc.data();
                return { id: doc.id, ...dataWithoutCreatedAt };
            });
            setPending(requests);
        });

        const matchreqRef = collection(db, 'Request');
        const q1 = query(matchreqRef, orderBy('friendRequests'));
        const unsubscribeMatchReq = onSnapshot(q1, (snapshot) => {
            const request = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setFriends(request);
        });

        return () => {
            unsubscribe();
            unsubscribeMatchReq();
        };
    }, []);

    useEffect(() => {
        if (pending.length > 0 && user) {
            const userPending = pending.filter(pen =>
                pen.friendRequests.some(data => data.id1 === user.uid || data.id2 === user.uid)
            );
            const matchFriends = friends.filter(data => {
                if ((data.friendRequests[0]?.id1 === user.uid || data.friendRequests[1]?.id2 === user.uid) &&
                    (data.friendRequests[0]?.status === true && data.friendRequests[1]?.status === true)) {
                    return data;
                } else {
                    return null;
                }
            });
            setMatchFriends(matchFriends);
            setMyPending(userPending.length > 0 ? userPending : []);
        }

    }, [pending, user, friends]);

    useEffect(() => {
        const friendshipStatus = myPending.map(pendingItem => ({
            id: pendingItem.id,
            status1: pendingItem.friendRequests[0]?.status,
            status2: pendingItem.friendRequests[1]?.status
        }));

        const acceptedRequests = friendshipStatus.filter(data => data.status1 === null && data.status2 === true);
        setSpecific(acceptedRequests.length);
        setFriendValue(matchFriends.length);
    }, [myPending, matchFriends]);


    return {friends}
}

export default useInvisible