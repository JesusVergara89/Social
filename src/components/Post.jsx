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
import Postuserinfo from './Postuserinfo';

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

    ///console.log(post[0].images[0])

    return (
        <article className="post">
            <button onClick={() => createPost('/createpost')} className="post-create-btn">New post</button>
            {post && (
                post.map((p, i) => (
                    <div key={i} className="post-card">
                        <Postuserinfo p={p} />
                        <Renderimagespost id={p.id} images={p.images} />
                        <Deletebtn images={p.images} deleteId={p.id} postId={p.idOnlineUser} toProfile={toProfile} />
                        <div className="post-card-msg-likes">
                            <Likepost postId={p.id} likes={p.likes} />
                            <Countercomments thispost={p} />
                        </div>
                        <p className='post-card-description'>{p.description}</p>
                        <Comment
                            thispost={p}
                            postId={p.id}
                            reload={reload}
                        />

                        <Displaycomments infousers={infousers} AllPost={post} post={p} />
                    </div>
                ))
            )}
        </article>
    )
}

export default Post