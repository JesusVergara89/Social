import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import Displaycomments from './Displaycomments'
import Comment from './Comment'
import '../style/Post.css'
import Deletebtn from './Deletebtn'
import Countercomments from '../counters/Countercomments'
import Likepost from './Likescomponents/Likepost'
import Renderimagespost from './Renderimagespost'
import Postuserinfo from './Postuserinfo'

const Singlepost = () => {

    const { post } = useParams()
    const [singlepost, setSinglepost] = useState('')
    const [onlyIds, setOnlyIds] = useState([])
    const [infousers, setInfousers] = useState([]);
    const [returncomments, setReturncomments] = useState(false)
    const [toProfileAfterDeleted, setToProfileAfterDeleted] = useState(false)
    const navigate = useNavigate()

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
            const usersWithNames = usex.map(user => ({
                id: user.id,
                userName: user.userName
            }));
            setInfousers(usex);
            setOnlyIds(usersWithNames)
        })
        
    }, [])

    const toProfile = () => {
        setToProfileAfterDeleted(!toProfileAfterDeleted)
        navigate('/profile')
    }

    return (
        <div className='post'>
            {singlepost.id && singlepost.likes &&
                <div className="post-card">
                    <Postuserinfo p={singlepost} IdAndUserName={onlyIds}/>
                    <Renderimagespost id={singlepost.id} images={singlepost.images} />
                    <Deletebtn images={singlepost.images} deleteId={singlepost.id} postId={singlepost.idOnlineUser} toProfile={toProfile} />
                    <div className="post-card-msg-likes">
                        <Likepost postId={singlepost.id} likes={singlepost.likes} />
                        <Countercomments thispost={singlepost} />
                    </div>
                    <p className='post-card-description'>{singlepost.description}</p>
                    <Comment
                        thispost={singlepost}
                        postId={singlepost.id}
                        reload={reload}
                    />
                    <Displaycomments infousers={infousers} post={singlepost} />
                </div>
            }
        </div>
    )
}

export default Singlepost

