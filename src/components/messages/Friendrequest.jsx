import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useParams } from 'react-router-dom'
import { auth, db } from '../../firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'
import { toast } from 'react-toastify'
import './Friendrequest.css'

const Friendrequest = () => {
    const { id } = useParams()
    const [user] = useAuthState(auth)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const postRef = collection(db, 'Request');
            const newPost = {
                friendRequests: [
                    {
                        createdAt: new Date(),
                        id1: id,
                        status: false
                    },
                    {
                        createdAt: new Date(),
                        id2: user.uid,
                        status: true
                    }
                ]
            }
            await addDoc(postRef, newPost);

            toast('Request successfully', { type: 'success' });
        } catch (error) {
            console.error('Error request: ', error);
            toast('Error request', { type: 'error' });
        }
    };

    return (
        <div className='Friendrequest'>
            <h3>Solicitud de amistad</h3>
            <button onClick={handleSubmit}>Enviar</button>
        </div>
    )
}

export default Friendrequest
