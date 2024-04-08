import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'
import '../style/DeleteComment.css'

const DeleteComment = ({ post , commentPosition }) => {

    const [currentoLogUser] = useAuthState(auth)

    const handleDeletePost = async () => {
        try {
            const docRef = doc(db, 'Post', post.id); 
            const docSnap = await getDoc(docRef); 
            if (docSnap.exists()) {
                let commentsData = docSnap.data().comments; 
                if (commentsData) {
                    commentsData.splice(commentPosition, 1); 
                    await updateDoc(docRef, { comments: commentsData }); 
                } else {
                    console.log('No se encontraron comentarios');
                }
            } else {
                console.log('No existe el documento');
            }
        } catch (error) {
            console.log('Error obteniendo documento:', error);
        }
    }

    //console.log(post.comments[commentPosition].idUser)

    return (
        <>
            {currentoLogUser?.uid === post.comments[commentPosition].idUser ?
                <div className="delete-btn-1">
                    <button onClick={handleDeletePost}><i className='bx bxs-x-circle'></i></button>
                </div>
                :
                ''
            }
        </>
    )
}

export default DeleteComment
