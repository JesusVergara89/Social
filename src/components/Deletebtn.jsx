import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, storage } from '../firebaseConfig'
import '../style/Deletebtn.css'
import { deleteDoc, doc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { deleteObject, ref } from 'firebase/storage'

const Deletebtn = ({ image, deleteId, postId, toProfile }) => {

    const [currentoLogUser] = useAuthState(auth)

    const handleDeletePost = async () => {
        try {
            await deleteDoc(doc(db, "Post", deleteId))
            toast('post deleted successfully', { type: 'success' })
            const storeref = ref(storage, image)
            await deleteObject(storeref)
            toProfile()
        } catch (er) {
            console.log(er)
        }
    }
    return (
        <>
            {currentoLogUser?.uid === postId ?
                <div className="delete-btn">
                    <button onClick={handleDeletePost} ><i className='bx bxs-x-circle'></i></button>
                </div>
                :
                ''
            }
        </>
    )
}

export default Deletebtn