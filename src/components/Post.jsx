import React, { useEffect, useState } from 'react'
import '../style/Post.css'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Comment from './Comment';
import Displaycomments from './Displaycomments';
import { Link, useNavigate } from 'react-router-dom';
import Deletebtn from './Deletebtn';
import Countercomments from '../counters/Countercomments';
import Likepost from './Likescomponents/Likepost';

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

    ///console.log(post[0].id)

    return (
        <article className="post">
            <button onClick={() => createPost('/createpost')} className="post-create-btn">New post</button>
            {post && (
                post.map((p, i) => (
                    <div key={i} className="post-card">
                        <Link key={i / 2.5} to={`/singlepost/${p.id}`}>
                            <img className='post-card-mainimg' src={p.image} alt="" />
                        </Link>
                        <Deletebtn image={p.image} deleteId={p.id} postId={p.idOnlineUser} toProfile={toProfile} />
                        <div className="post-card-userinfo">
                        <Likepost postId={p.id}  likes={p.likes}/>
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
            )}
        </article>
    )
}

export default Post