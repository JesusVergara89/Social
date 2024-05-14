import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, storage } from '../firebaseConfig'
import '../style/Deletebtn.css'
import { deleteDoc, doc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { deleteObject, ref } from 'firebase/storage'

const Deletebtn = ({ images, deleteId, postId, toProfile }) => {

    const [currentoLogUser] = useAuthState(auth)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)

    const handleDeletePost = async () => {
        try {

            await deleteDoc(doc(db, "Post", deleteId))

            await Promise.all(images.map(async (image) => {
                const storeref = ref(storage, image);
                await deleteObject(storeref);
            }));

            toast('post deleted successfully', { type: 'success' });
            toProfile();
        } catch (er) {
            console.log(er);
        }
    }

    const functionDelete = () => {
        setDeleteConfirmation(!deleteConfirmation)
    }

    return (
        <>
            {currentoLogUser?.uid === postId ?
                <div className={`${deleteConfirmation === true ? 'delete-btn active' : 'delete-btn'}`}>
                    {deleteConfirmation ?
                        <div className="delete-btn-warning">
                            <h5>¿Eliminar este post?</h5>
                            <button onClick={handleDeletePost}><i className='bx bxs-trash'></i></button>
                            <h5>Regresar al post</h5>
                            <i onClick={functionDelete} className='bx bx-arrow-back' ></i>
                        </div>
                        :
                        <i onClick={functionDelete} className='bx bx-dots-horizontal '></i>
                    }
                </div>
                :
                ''
            }
            <div className={`${deleteConfirmation === true ? 'delete-btn-block' : 'delete-btn-no-blok' }`}></div>
        </>
    )
}

export default Deletebtn;
