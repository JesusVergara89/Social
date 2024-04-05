import React, { useEffect, useState } from 'react'
import '../style/Mypost.css'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import Renderpost from './Renderpost';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPostNumberValue } from '../store/slices/postnumber.slice';

const Mypost = () => {

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
    useEffect(()=>{
        setFriendValue(myPost.length)
    },[myPost])
    //console.log(myPost.length)
    return (
        <div className="Mypost">
            {myPost &&
                myPost.map((post, i) => (
                    <Link to={`/singlepost/${post.id}`} key={i / 2}>
                        <Renderpost key={i} post={post} />
                    </Link>
                ))
            }
        </div>
    )
}

export default Mypost