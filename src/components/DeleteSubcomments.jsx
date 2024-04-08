import React from 'react'
import '../style/DeleteSubcomments.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const DeleteSubcomments = ({ post, sub, indexSub }) => {

    const [currentoLogUser] = useAuthState(auth)

    const handleDeletePost = async () => {
        try {
            const docRef = doc(db, 'Post', post.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let commentsData = docSnap.data().comments;
                if (commentsData) {
                    let claves = ['one', 'two', 'three', 'four'];
                    if (commentsData[0].others && claves[indexSub]) {
                        let subcomentario = commentsData[0].others[claves[indexSub]];
                        subcomentario.content = "";
                        subcomentario.createdAt = null;
                        subcomentario.userID = "";
                        subcomentario.userName = "";
                        await updateDoc(docRef, { comments: commentsData });
                        console.log('Subcomentario eliminado exitosamente');
                    } else {
                        console.log('El subcomentario no existe');
                    }
                } else {
                    console.log('No se encontraron comentarios');
                }
            } else {
                console.log('No existe el documento');
            }
        } catch (error) {
            console.log('Error obteniendo documento:', error);
        }
    };

    //console.log(indexSub)

    return (
        <>
            {currentoLogUser?.uid === sub.userID ?
                <div className="delete-btn-2">
                    <button onClick={handleDeletePost}><i className='bx bxs-x-circle'></i></button>
                </div>
                :
                ''
            }
        </>
    )
}

export default DeleteSubcomments