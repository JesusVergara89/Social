import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const Friendcounter = () => {

    const [friends, setFriends] = useState()
    const [user] = useAuthState(auth)

    useEffect(() => {
        const messagesRef = collection(db, 'Request')
        const q = query(messagesRef, orderBy('friendRequests'))
        onSnapshot(q, (snapshot) => {
            const request = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setFriends(request)
        })
    }, []);

    const matchFriends = friends.filter(data => {
        for (let i = 0; i < data.friendRequests.length; i++) {
            if ((data.friendRequests[i].id1 === user.uid || data.friendRequests[i].id2 === user.uid) &&
                data.friendRequests[i].status === true && data.friendRequests[i + 1].status === true) {
                return data;
            }
        }
        return false;
    });



    console.log(matchFriends)

    return (
        <div>
            {matchFriends.length}
        </div>
    )
}

export default Friendcounter