import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const useConnections = () => {

    const [allrequest, setAllrequest] = useState([]);
    const [usersall, setUsersall] = useState([]);
    const [userlog] = useAuthState(auth);
    const [allpost, setAllpost] = useState([])

    useEffect(() => {
        {/**Request to Users */ }
        const reqRef = collection(db, 'Users');
        const q = query(reqRef, orderBy('userName'));
        onSnapshot(q, (snapshot) => {
            const reqData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsersall(reqData);
        });
        {/**End Request to Users */ }

        {/**Request to Requests */ }
        const userRef = collection(db, 'Request');
        const q1 = query(userRef, orderBy('friendRequests'));
        onSnapshot(q1, (snapshot) => {
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllrequest(userData);
        });
        {/**End Request to Request */ }

        {/**Request to Posts */ }
        const postRef = collection(db, 'Post');
        const q2 = query(postRef, orderBy('userName'));
        onSnapshot(q2, (snapshot) => {
            const postData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllpost(postData);
        });
        {/**End Request to Post */ }
    }, []);

    const myRequests = allrequest.filter((data, i) => {
        if (userlog && userlog.uid) {
            if ((data.friendRequests[0].id1 === userlog.uid || data.friendRequests[1].id2 === userlog.uid)
                && (data.friendRequests[0].status === true && data.friendRequests[1].status)) {
                return data.friendRequests
            }
        }
        return false;
    })

    const onlyFriendRequests = myRequests.map(data => data.friendRequests)

    {/*onlyFriendRequests[0][0].id1
    onlyFriendRequests[0][1].id2
    onlyFriendRequests[1][0].id1
    onlyFriendRequests[1][1].id2*/}

    const obtenerIds = (array) => {
        const ids = [];
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                ids.push(array[i][j]['id' + (j + 1)]);
            }
        }
        return ids;
    }

    const ids = obtenerIds(onlyFriendRequests);
    const idsMatchFriends = ids.filter(data => {
        if (data !== userlog.uid) {
            return data
        }
    })

    const findFriends = usersall.filter((data) => {
        for (let i = 0; i < idsMatchFriends.length; i++) {
            if (data.idUser === idsMatchFriends[i]) {
                return true;
            }
        }
        return false;
    });

    const counterConnectios = (array, id) => {
        let aux = []
        aux = array.filter((data) => {
            if ((data.friendRequests[0].id1 === id || data.friendRequests[1].id2 === id)
                && (data.friendRequests[0].status === true && data.friendRequests[1].status)) {
                return data.friendRequests
            }
        })
        return aux.length
    }

    const counterPost = (array, id) => {
        let aux = []
        aux = array.filter((data) => {
            if (data.idOnlineUser === id) {
                return data
            }
        })
        return aux.length
    }

    return { counterPost, counterConnectios, findFriends, userlog, allpost, allrequest, usersall }
}

export default useConnections