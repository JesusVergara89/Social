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
    }, [pending]);

    let ExtractedObjs = [];

    for (let i = 0; i < pending.length; i++) {
        const objcurrent = pending[i].friendRequests[0];
        const objnext = pending[i].friendRequests[1];

        const ExtractedObj = {
            id1: objcurrent.id1,
            id2: objnext.id2,
            status1: objcurrent.status,
            status2: objnext.status
        };

        ExtractedObjs.push(ExtractedObj);

    }

    const thisObject = ExtractedObjs.find(obj =>
        obj.id1 === id && obj.id2 === user.uid || obj.id1 === user.uid && obj.id2 === id
    );

    let friendshipStatus = '';

    if (thisObject && typeof thisObject === 'object') {
        const element = thisObject;
        if (element.status1 === true && element.status2 === true) {
            friendshipStatus = 'x';
        } else if (element.status1 === false && element.status2 === true) {
            friendshipStatus = 'y';
        } else if (element.status1 === null && element.status2 === true) {
            friendshipStatus = 'z';
        } else {
            friendshipStatus = 'w';
        }
    } else {
        friendshipStatus = undefined;
    }

    ////////////////////////////////////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (friendshipStatus === 'w' || friendshipStatus === undefined) {
            try {
                const postRef = collection(db, 'Request');
                const msgRef = collection(db, 'timerMsg');
                const newPost = {
                    friendRequests: [
                        {
                            createdAt: new Date(),
                            id1: id,
                            status: null
                        },
                        {
                            createdAt: new Date(),
                            id2: user.uid,
                            status: true
                        }
                    ]
                }
                await addDoc(postRef, newPost);
                const data = [{ creatorID: user.uid, receptorID: id, userNameS: '', userNameR: '', time: new Date() }]
                await addDoc(msgRef, {
                    data
                });
                toast('Request successfully', { type: 'success' });
            } catch (error) {
                console.error('Error request: ', error);
                toast('Error request', { type: 'error' });
            }
        } else if (friendshipStatus === 'x') {
            toast('ya eres amigo de esta persona', { type: 'error' });
        } else if (friendshipStatus === 'y') {
            toast('Esta persona rechazo la solicitud', { type: 'error' });
        } else if (friendshipStatus === 'z') {
            toast('Ya has mandado una solicitud a este usuario', { type: 'error' });
        }
        else {
            toast('Comunicate con la plataformar', { type: 'error' });
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
