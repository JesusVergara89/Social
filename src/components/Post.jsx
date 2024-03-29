import React, { useEffect, useState } from 'react'
import '../style/Post.css'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Comment from './Comment';
import Displaycomments from './Displaycomments';
import { useNavigate } from 'react-router-dom';

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

   
    return (
        <article className="post">
            <button onClick={()=> createPost('/createpost')} className="post-create-btn">New post</button>
            {post && (
                post.map((p, i) => (
                    <div key={i} className="post-card">
                        <img src={p.image} alt="" />
                        <p>{p.description}</p>
                        <Comment
                            thispost={p}
                            postId={p.id}
                            reload={reload}
                        />
                        <Displaycomments AllPost={post}  post={p} />
                    </div>
                ))
            )}
        </article>
    )
}

export default Post