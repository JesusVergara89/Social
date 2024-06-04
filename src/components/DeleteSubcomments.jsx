import React from 'react'
import '../style/DeleteSubcomments.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const DeleteSubcomments = ({ post, subcommentsFormatted}) => {

    const [currentoLogUser] = useAuthState(auth)

    const handleDeletePost = async (data) => {
        try {
            const docRef = doc(db, 'Post', post.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let commentsData = docSnap.data().comments;
                let keyFound = null;
                for (let i = 0; i < commentsData.length; i++) {
                    for (let clave in commentsData[i].others) {
                        let data1 = commentsData[i].others[clave];
                        if (data1.content == data.content && data1.userID == data.userID) {
                            keyFound = clave;
                            break;
                        }
                    }
                    if (keyFound) {
                        delete commentsData[i].others[keyFound];
                        let emptyObject = {
                            content: "",
                            createdAt: null,
                            userID: ""
                        };
                        commentsData[i].others[keyFound] = emptyObject;
                        await updateDoc(docRef, { comments: commentsData });
                        console.log(`Subcomentario ${keyFound} eliminado`);
                        break; 
                    }
                }
                if (!keyFound) {
                    console.log('No se encontró el subcomentario a eliminar');
                }
            }
        } catch (error) {
            console.log('Error obteniendo documento:', error);
        }
    };


    //console.log(subcommentsFormatted)

    return (
        <>
            {currentoLogUser?.uid === subcommentsFormatted.userID ?
                <div className="delete-btn-2">
                    <button onClick={() => handleDeletePost(subcommentsFormatted)}><i className='bx bxs-trash-alt' ></i></button>
                </div>
                :
                ''
            }
        </>
    )
}

export default DeleteSubcomments