import React from 'react'
import './Likepost.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../firebaseConfig'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const Likepost = ({ postId, likes }) => {
    
    const [currentUser] = useAuthState(auth)
    const likesRef = doc(db, "Post", postId)
    const handleClick = ()=> {
        if(likes?.includes(currentUser?.uid)){
            updateDoc(likesRef, {
                likes: arrayRemove(currentUser?.uid)
            }).then(()=>{
                console.log('unliked')
            }).catch((e)=>{
                console.log(e)
            })
        }else{
            updateDoc(likesRef, {
                likes: arrayUnion(currentUser?.uid)
            }).then(()=>{
                console.log('liked')
            }).catch((e)=>{
                console.log(e)
            })
        }
    }
    return (
        <div className="Likepost">
            <h6>{likes?.length}</h6>
            <i className={`fa fa-heart${!likes?.includes(currentUser?.uid) ? '-o' : ''} fa-lg`}
            style={{
                cursor: 'pointer',
                color: likes?.includes(currentUser?.uid) ? 'red' : null
            }}
            onClick={handleClick}
            />
        </div>
    )
}

export default Likepost