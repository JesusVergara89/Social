import React, { useEffect, useState } from 'react'
import './Pendingfriendrequests.css'
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const Pendingfriendrequests = () => {

    const [pending, setPending] = useState([]);
    const [myPending, setMyPending] = useState([])

    const [user] = useAuthState(auth)

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
                pen.friendRequests.some(data => data.id1 === user.uid)
            );
            setMyPending(userPending);
        }
    };

    useEffect(() => {
        verifyMyPending()
    }, [pending])

    console.log(myPending)

    const handleAccept = () => {
        if (myPending.length > 0) {
            const friendRequests = myPending[0].friendRequests.map((request, index) => {
                if (index === 0) {
                    return { ...request, status: true };
                }
                return request;
            });

            const acceptRef = doc(db, "Request", myPending[0].id);

            updateDoc(acceptRef, { friendRequests })
                .then(() => {
                    console.log("Documento actualizado exitosamente.");
                })
                .catch((error) => {
                    console.error("Error al actualizar el documento:", error);
                });
        } else {
            console.log("No hay solicitudes pendientes para aceptar.");
        }
    };

    return (
        <div className='Pendingfriendrequests'>
            <h2>{`Hola ${user.displayName} tienes`}</h2>
            <h2>{`${myPending && myPending.length} solicitud de amistad`}</h2>
            {myPending && myPending.map((requestsArray, i) => (
                <div key={i} className='card-Pendingfriendrequests'>
                    {requestsArray.friendRequests.map((request, j) => (
                        <div key={j}>
                            <h5>{request.id1}</h5>
                            <h5>{request.id2}</h5>
                            <h5>{request.status === true ? 'true' : 'false'}</h5>
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleAccept}>update</button>
        </div>
    )
}

export default Pendingfriendrequests