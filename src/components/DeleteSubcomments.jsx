import React from 'react'
import '../style/DeleteSubcomments.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const DeleteSubcomments = ({ post, sub, subcommentsFormatted, indexSub }) => {

    const [currentoLogUser] = useAuthState(auth)

    const handleDeletePost = async (data) => {
        try {
            const docRef = doc(db, 'Post', post.id);
            const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    let commentsData = docSnap.data().comments;
                    let keyFound = null;
                    for (let clave in commentsData[0].others) {
                        let data1 = commentsData[0].others[clave];
                        if (data1.content == data.content &&
                            data1.userID == data.userID) {
                                keyFound = clave;
                            break;
                        }
                    }
                    if (keyFound) {
                        delete commentsData[0].others[keyFound];
                        let emptyObject = {
                            content: "",
                            createdAt: null,
                            userID: ""
                        };
                        commentsData[0].others[keyFound] = emptyObject;
                        await updateDoc(docRef, { comments: commentsData });
                        console.log(`subcomentario ${keyFound} eliminado`);
                    } else {
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
            {currentoLogUser?.uid === subcommentsFormatted[indexSub].userID ?
                <div className="delete-btn-2">
                    <button onClick={() => handleDeletePost(subcommentsFormatted[indexSub])}><i className='bx bxs-x-circle'></i></button>
                </div>
                :
                ''
            }
        </>
    )
}

export default DeleteSubcomments