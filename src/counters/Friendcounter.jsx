import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Friendcounter.css'

const Friendcounter = () => {

    const [friends, setFriends] = useState()
    const [user] = useAuthState(auth)
    {/*const [matchFriends, setmatchFriends] = useState(second)*/ }

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

    let matchFriends = []

    if (friends) {
        matchFriends = friends.filter(data => {
            if ((data.friendRequests[0].id1 === user.uid || data.friendRequests[1].id2 === user.uid) &&
                (data.friendRequests[0].status === true && data.friendRequests[1].status === true)) {
                return data
            } else {
                []
            }
        })
    }

    //console.log(matchFriends)

    return (
        <div className='Friendcounter'>
            <div className="Friendcounter-number">
                <h4><span>{matchFriends.length}</span></h4>
            </div>
            <div className="Friendcounter-connections">
                <h4>Conexiones</h4>
            </div>
        </div>
    )
}

export default Friendcounter