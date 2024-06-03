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
import Postuserinfo from './Postuserinfo';
import PostSkeleton from './Loading/PostSkeleton';
import Story from './stories/Story';
import { useDispatch, useSelector } from 'react-redux';
import Groupofstories from './stories/Groupofstories';
import { setIsActive } from '../store/slices/stories.slice';

const Post = () => {
    const [post, setPost] = useState();
    const [onlyIds, setOnlyIds] = useState([])
    const [infousers, setInfousers] = useState([]);
    const [returncomments, setReturncomments] = useState(false)

    const items = useSelector((state) => state.story.items);
    const isActive = useSelector((state) => state.story.isActive);

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
            const usersWithNames = usex.map(user => ({
                id: user.id,
                userName: user.userName,
                idUser: user.idUser
            }));
            setInfousers(usex);
            setOnlyIds(usersWithNames)
        })
    }, [post]);

    const toProfile = () => {
        console.log('')
    }

    const dispatch = useDispatch();
    
    const handleSetActivate = (value) => dispatch(setIsActive(value));

    return (
        <article className="post">
            <h3 className='under-constructions'>Stories are under constructions</h3>
            <Story />
            {isActive &&
                <i onClick={() => { handleSetActivate(false) }} className='bx bxs-x-circle'></i>
            }
            {isActive &&
                <Groupofstories story={items} />
            }

            {post ? (
                post.map((p, i) => {
                    return (
                        <div key={i} className={`post-card ${isActive === true ? 'blur' : ''}`}>
                            <Postuserinfo p={p} IdAndUserName={onlyIds} />
                            <Renderimagespost id={p.id} images={p.images} />
                            <Deletebtn images={p.images} deleteId={p.id} postId={p.idOnlineUser} toProfile={toProfile} />
                            <div className="post-card-msg-likes">
                                <Likepost postId={p.id} likes={p.likes} />
                                <Countercomments thispost={p} index={i} />
                            </div>
                            <p className='post-card-description'>{p.description}</p>
                            <Displaycomments post={p} reload={reload} IdAndUserName={onlyIds} />
                        </div>
                    );
                })
            ) : <PostSkeleton />}

        </article>
    )
}

export default Post