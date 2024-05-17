import React from 'react'
import './Likepost.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../firebaseConfig'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';

const Likepost = ({ postId, likes }) => {
    const navigate = useNavigate();

    const [currentUser] = useAuthState(auth)
    const likesRef = doc(db, "Post", postId)
    const handleClick = () => {
        if (currentUser) {
            if (likes?.includes(currentUser?.uid)) {
                updateDoc(likesRef, {
                    likes: arrayRemove(currentUser?.uid)
                }).then(() => {
                    console.log('unliked')
                }).catch((e) => {
                    console.log(e)
                })
            } else {
                updateDoc(likesRef, {
                    likes: arrayUnion(currentUser?.uid)
                }).then(() => {
                    console.log('liked')
                }).catch((e) => {
                    console.log(e)
                })
            }
        } else {
            navigate('/login')
        }
    }
    return (
        <div className="Likepost">
            <i className={!likes?.includes(currentUser?.uid) ? 'bx bx-heart' : 'bx bxs-heart on'}
                onClick={handleClick} />
            <h6>{likes.length === 0 ? '' : likes.length}</h6>
        </div>
    )
}

export default Likepost