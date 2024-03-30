import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useParams } from 'react-router-dom'
import { auth, db } from '../../firebaseConfig'
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore'
import { toast } from 'react-toastify'
import './Friendrequest.css'

const Friendrequest = () => {
    const { id } = useParams()
    const [user] = useAuthState(auth)
    const [pending, setPending] = useState([]);
    const [myPending, setMyPending] = useState([])

    ////////////////////////////////////////////////////////////////////
    {/** Aqui solicito la db Reques a ver si ya son amigos para impedir que vuelvan 
      a mandar solicitud de amistad*/}

    useEffect(() => {
        const usersCollectionRef = collection(db, 'Request');
        const q = query(usersCollectionRef);
        onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map((doc) => {
                const { createdAt, ...dataWithoutCreatedAt } = doc.data();
                return { id: doc.id, ...dataWithoutCreatedAt };
            });
            setPending(requests);
        });
    }, []);


    const verifyMyPending = () => {
        if (pending) {
            const userPending = pending.filter(pen =>
                pen.friendRequests.some(data => data.id1 === user.uid) &&
                !pen.friendRequests.every(data => data.status === true) &&///// agregar logica para los demas condiciones false verdadero
                !pen.friendRequests.every(data => data.status === false)
            );
            setMyPending(userPending.length > 0 ? userPending : null);
        }
    };

    useEffect(() => {
        verifyMyPending()
    }, [pending])

    console.log(pending)

    ////////////////////////////////////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (myPending) {
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
        }
        else {
            toast('ya eres amigo de esta persona o solicitud de amistad rechazada', { type: 'error' });
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
