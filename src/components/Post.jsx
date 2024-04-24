import React, { useEffect, useState } from 'react'
import '../style/Post.css'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Comment from './Comment';
import Displaycomments from './Displaycomments';
import { useNavigate } from 'react-router-dom';
import Deletebtn from './Deletebtn';
import Countercomments from '../counters/Countercomments';
import Likepost from './Likescomponents/Likepost';
import Renderimagespost from './Renderimagespost';
import PostSkeleton from './Loading/PostSkeleton';

const Post = () => {

    const [post, setPost] = useState([]);
    const [infousers, setInfousers] = useState([]);
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

    useEffect(() => {
        const usersCollectionRef = collection(db, 'Users');
        const q = query(usersCollectionRef, orderBy('userName'))
        onSnapshot(q, (snapshot) => {
            const usex = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setInfousers(usex);
        })
    }, [post]);

    const toProfile = () => {
        console.log('')
    }
    
    return (
        <article className="post">
            <button onClick={() => createPost('/createpost')} className="post-create-btn">New post</button>
            {post?.[0] ? (
                post.map((p, i) => (
                    <div key={i} className="post-card">
                        <div className="post-card-img-container">
                            <Renderimagespost id={p.id} images={p.images} />
                        </div>
                        <Deletebtn images={p.images} deleteId={p.id} postId={p.idOnlineUser} toProfile={toProfile} />
                        <div className="post-card-userinfo">
                            <Likepost postId={p.id} likes={p.likes} />
                            <div className="post-card-userinfo-1">
                                <img src={p.userPhoto} alt="" />
                                <h6>{`${p.userName}`}</h6>
                            </div>
                            <div className="post-card-userinfo-2">
                                <h6>{p.createdAt.toDate().toDateString()}</h6>
                            </div>
                        </div>
                        <p className='post-card-description'>{p.description}</p>
                        <Comment
                            thispost={p}
                            postId={p.id}
                            reload={reload}
                        />
                        <Countercomments thispost={p} />
                        <Displaycomments infousers={infousers} AllPost={post} post={p} />
                    </div>
                ))
            ) : <PostSkeleton />}
        </article>
    )
}

export default Post