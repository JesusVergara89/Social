import React, { useEffect, useState } from 'react'
import '../style/Post.css'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Displaycomments from './Displaycomments';
import { useNavigate } from 'react-router-dom';
import Deletebtn from './Deletebtn';
import Countercomments from '../counters/Countercomments';
import Likepost from './Likescomponents/Likepost';
import Renderimagespost from './Renderimagespost';
import PostSkeleton from './Loading/PostSkeleton';

const Post = () => {
    const [post, setPost] = useState([]);
    const [returncomments, setReturncomments] = useState(false)

    const createPost = useNavigate()
    const reload = () => setReturncomments(!returncomments)

    useEffect(() => {
        const usersCollectionRef = collection(db, 'Post');
        const q = query(usersCollectionRef, orderBy("createdAt", "desc"))
        onSnapshot(q, (snapshot) => {
            const allpost = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setPost(allpost)
        })
    }, [returncomments]);


    const toProfile = () => {
        console.log('')
    }

    return (
        <article className="post">
            <button onClick={() => createPost('/createpost')} className="post-create-btn">New post</button>
            {post?.[0] ? (
                post.map((p, i) => (
                    <div key={i} className="post-card">
                        <div className="post-card-userinfo">
                            <div className="post-card-userinfo-1">
                                <img src={p.userPhoto} alt="" />
                                <h6>{`@${p.userName}`}</h6>
                            </div>
                            <div className="post-card-userinfo-2">
                                <h6>{p.createdAt.toDate().toDateString()}</h6>
                            </div>
                        </div>
                        <div className="post-card-img-container">
                            <Renderimagespost id={p.id} images={p.images} />
                        </div>
                        <div className='post-card-action'>
                            <Likepost postId={p.id} likes={p.likes} />
                            <Countercomments thispost={p} />
                        </div>
                        <Deletebtn images={p.images} deleteId={p.id} postId={p.idOnlineUser} toProfile={toProfile} />
                        <p className='post-card-description'>{p.description}</p>
                        <Displaycomments post={p} reload={reload} />
                    </div>
                ))
            ) : <PostSkeleton />}
        </article>
    )
}

export default Post