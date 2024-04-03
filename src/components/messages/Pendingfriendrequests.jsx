import React, { useEffect, useState } from 'react';
import './Pendingfriendrequests.css';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const Pendingfriendrequests = () => {
    const [pending, setPending] = useState([]);
    const [myPending, setMyPending] = useState([]);
    const [user] = useAuthState(auth);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Request'), (snapshot) => {
            const requests = snapshot.docs.map((doc) => {
                const { createdAt, ...dataWithoutCreatedAt } = doc.data();
                return { id: doc.id, ...dataWithoutCreatedAt };
            });
            setPending(requests);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (pending) {
            const userPending = pending.filter(pen =>
                pen.friendRequests.some(data => data.id1 === user.uid || data.id2 === user.uid)
            );
            setMyPending(userPending.length > 0 ? userPending : null);
        }
    }, [pending, user]);

    let friendshipStatus = [];
    if (myPending && myPending.length > 0) {
        let ExtractedObjs = [];
        for (let i = 0; i < myPending.length; i++) {
            const objcurrent = myPending[i].friendRequests[0];
            const objnext = myPending[i].friendRequests[1];
            const ExtractedObj = {
                id: myPending[i].id,
                id1: objcurrent.id1,
                id2: objnext.id2,
                status1: objcurrent.status,
                status2: objnext.status
            };
            ExtractedObjs.push(ExtractedObj);
        }
        friendshipStatus = ExtractedObjs
    }

    const statusFrienship = friendshipStatus.filter(data => data.status1 === null && data.status2 === true)

    const handleAccept = (id, statusFrienshipId) => {
        const index = pending.findIndex(item => item.id === statusFrienshipId);
        if (index !== -1) {
            const requestId = pending[index].id;
            const friendRequests = pending[index].friendRequests.map((request, idx) => {
                if (idx === 0) {
                    if (id === 'x') {
                        return { ...request, status: true };
                    } else if (id === 'y') {
                        return { ...request, status: false };
                    }
                }
                return request;
            });

            const acceptRef = doc(db, "Request", requestId);

            updateDoc(acceptRef, { friendRequests })
                .then(() => {
                    console.log("Documento actualizado exitosamente.");
                })
                .catch((error) => {
                    console.error("Error al actualizar el documento:", error);
                });
        } else {
            console.error("No se encontró ningún objeto en pending que coincida con el ID proporcionado.");
        }
    };

    return (
        <>{friendshipStatus === 0 ?
            <h2 className='no-request'>No tienes solicitudes</h2>
            :
            (
                <div className='Pendingfriendrequests'>
                    <h2>Hola <span>{user.displayName}</span>, tienes</h2>
                    <h2>{<span>{statusFrienship === 0 ? 0 : statusFrienship.length}</span>} solicitud(es) de amistad de:</h2>
                    {statusFrienship && statusFrienship.map((request, i) => (
                        <>
                            <div key={i} className='card-Pendingfriendrequests'>
                                <div >
                                    <h5>{request.id1}</h5>
                                    <h5>{request.id2}</h5>
                                </div>
                                <button onClick={() => handleAccept('x', statusFrienship[0].id)}>acceptar</button>
                                <button onClick={() => handleAccept('y', statusFrienship[0].id)}>rechazar</button>
                            </div>
                        </>
                    ))}
                </div>
            )}
        </>
    )
}

export default Pendingfriendrequests;
