import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { setPostNumberValue } from '../store/slices/postnumber.slice';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const useMypost = () => {

    const [allmypost, setAllmypost] = useState([])
    const [onlineUser] = useAuthState(auth)
    const dispatch = useDispatch();
    const setFriendValue = (value) => dispatch(setPostNumberValue(value));

    useEffect(() => {
        const usersCollectionRef = collection(db, 'Post');
        const q = query(usersCollectionRef, orderBy("createdAt", "desc"))
        onSnapshot(q, (snapshot) => {
            const allpost = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setAllmypost(allpost)
        })
    }, []);

    const myPost = allmypost.filter((data) => {
        if (data.idOnlineUser === onlineUser.uid) {
            return data
        }
    })
    useEffect(() => {
        setFriendValue(myPost.length)
    }, [myPost])

    return { myPost }
}

export default useMypost