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
                pen.friendRequests.some(data => data.id1 === user.uid)
            );
            setMyPending(userPending.length > 0 ? userPending : null);
        }
    }, [pending, user]);

    let friendshipStatus = '';
    if (myPending && myPending.length > 0) {
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
            obj.id1 === myPending[0].friendRequests[0].id1 && obj.id2 === myPending[0].friendRequests[1].id2
        );
        if (thisObject && typeof thisObject === 'object') {
            const element = thisObject;
            if (element.status1 === true && element.status2 === true) {
                friendshipStatus = undefined;
            } else if (element.status1 === false && element.status2 === true) {
                friendshipStatus = undefined;
            } else if (element.status1 === null && element.status2 === true) {
                friendshipStatus = 'z';
            } else {
                friendshipStatus = undefined;
            }
        } else {
            friendshipStatus = undefined;
        }
    }

    const handleAccept = (id) => {
        if (friendshipStatus === 'z' && id === 'x') {
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
        } else if (friendshipStatus === 'z' && id === 'y') {
            const friendRequests = myPending[0].friendRequests.map((request, index) => {
                if (index === 0) {
                    return { ...request, status: false };
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
        }
    };

    return (
        <>{friendshipStatus === undefined ?
            <h2 className='no-request'>No tienes solicitudes</h2>
            :
            (
                <div className='Pendingfriendrequests'>
                    <h2>Hola <span>{user.displayName}</span>, tienes</h2>
                    <h2>{<span>{myPending === null ? 0 : myPending.length}</span>} solicitud(es) de amistad de:</h2>
                    {myPending && myPending.map((requestsArray, i) => (
                        <>
                            <div key={i} className='card-Pendingfriendrequests'>
                                {requestsArray.friendRequests.map((request, j) => (
                                    <div key={j}>
                                        <h5>{request.id1}</h5>
                                        <h5>{request.id2}</h5>
                                        <h5>{request.status === true ? 'true' : 'false'}</h5>
                                    </div>
                                ))}

                                <button onClick={() => handleAccept('x')}>acceptar</button>
                                <button onClick={() => handleAccept('y')}>rechazar</button>
                            </div>
                        </>
                    ))}
                </div>
            )}
        </>
    )
}

export default Pendingfriendrequests;
