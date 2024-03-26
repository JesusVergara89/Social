import React, { useEffect, useState } from 'react'
import '../style/Post.css'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Comment from './Comment';
import Displaycomments from './Displaycomments';

const Post = () => {

    const [post, setPost] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersCollectionRef = collection(db, 'Post');
                const usersSnapshot = await getDocs(usersCollectionRef);
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPost(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        getUsers();
    }, []);

    
    return (
        <article className="post">
            {post && (
                post.map((p, i) => (
                    <div key={i} className="post-card">
                        <img src={p.image} alt="" />
                        <p>{p.description}</p>
                        <Comment postId={p.id} />
                        <Displaycomments post={post}/>
                    </div>
                ))
            )}
        </article>
    )
}

export default Post