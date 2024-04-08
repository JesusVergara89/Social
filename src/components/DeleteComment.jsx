import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'
import '../style/DeleteComment.css'

const DeleteComment = ({ post , commentPosition }) => {
    const [currentoLogUser] = useAuthState(auth)

    const handleDeletePost = async () => {
        try {
            const docRef = doc(db, 'Post', post.id); // Referencia al documento
            const docSnap = await getDoc(docRef); // Obtener el documento
            if (docSnap.exists()) {
                let commentsData = docSnap.data().comments; // Obtener los comentarios
                if (commentsData) {
                    commentsData.splice(commentPosition, 1); // Eliminar el comentario
                    await updateDoc(docRef, { comments: commentsData }); // Actualizar el documento
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
