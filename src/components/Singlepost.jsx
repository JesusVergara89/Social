import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import Displaycomments from './Displaycomments'
import Comment from './Comment'
import '../style/Post.css'

const Singlepost = () => {

    const { post } = useParams()
    const [singlepost, setSinglepost] = useState('')
    const [postAll, setPostAll] = useState()
    const [infousers, setInfousers] = useState([]);
    const [returncomments, setReturncomments] = useState(false)

    const reload = () => setReturncomments(!returncomments)

    useEffect(() => {
        const postRef = doc(db, 'Post', post)
        onSnapshot(postRef, (snapshot) => {
            setSinglepost({ ...snapshot.data(), id: snapshot.id })
        })
        const usersCollectionRef = collection(db, 'Users');
        const q = query(usersCollectionRef, orderBy('userName'))
        onSnapshot(q, (snapshot) => {
            const usex = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setInfousers(usex);
        })
        const usersCollectionRef1 = collection(db, 'Post');
        const q1 = query(usersCollectionRef1, orderBy("createdAt", "desc"))
        onSnapshot(q1, (snapshot) => {
            const allpost = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setPostAll(allpost)
        })
    }, [])

    const formatCreatedAtDate = (sub) => {
        if (sub.createdAt && sub.createdAt.seconds) {
            const timestamp = sub.createdAt.seconds * 1000;
            const date = new Date(timestamp);
            return date.toDateString();
        }
        return '';
    }

    //console.log(singlepost)

    return (
        <div className='post'>
            <div className="post-card">
                <Link>
                    <img className='post-card-mainimg' src={singlepost.image} alt="" />
                </Link>
                <div className="post-card-userinfo">
                    <div className="post-card-userinfo-1">
                        <img src={singlepost.userPhoto} alt="" />
                        <h6>{`${singlepost.userName}`}</h6>
                    </div>
                    <div className="post-card-userinfo-2">
                        <h6>{singlepost && singlepost.createdAt && formatCreatedAtDate(singlepost)}</h6>
                    </div>
                </div>
                <p className='post-card-description'>{singlepost.description}</p>
                <Comment
                    thispost={singlepost}
                    postId={singlepost.id}
                    reload={reload}
                />
                <Displaycomments infousers={infousers} AllPost={postAll} post={singlepost} />
            </div>
        </div>
    )
}

export default Singlepost