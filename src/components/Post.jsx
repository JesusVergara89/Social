import React, { useEffect, useState } from 'react'
import '../style/Post.css'
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Comment from './Comment';
import Displaycomments from './Displaycomments';
import { useNavigate } from 'react-router-dom';

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
        const getUsers = async () => {
            try {
                const usersCollectionRef = collection(db, 'Users');
                const usersSnapshot = await getDocs(usersCollectionRef);
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setInfousers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        getUsers();
    }, [post]);

    //console.log(post)
   
    return (
        <article className="post">
            <button onClick={()=> createPost('/createpost')} className="post-create-btn">New post</button>
            {post && (
                post.map((p, i) => (
                    <div key={i} className="post-card">
                        <img className='post-card-mainimg' src={p.image} alt="" />
                        <div className="post-card-userinfo">
                            <div className="post-card-userinfo-1">
                               <img src={p.userPhoto} alt="" />
                               <h6>{`${p.userName}`}</h6> 
                            </div>
                            <div className="post-card-userinfo-2">
                               <h6>{p.createdAt.toDate().toDateString()}</h6> 
                            </div>
                        </div>
                        <p>{p.description}</p>
                        <Comment
                            thispost={p}
                            postId={p.id}
                            reload={reload}
                        />
                        <Displaycomments infousers={infousers} AllPost={post}  post={p} />
                    </div>
                ))
            )}
        </article>
    )
}

export default Post