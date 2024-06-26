import React, { useEffect, useState } from 'react'
import './Messageinbox.css'
import { Link, useParams } from 'react-router-dom'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import Messagescontainer from './Messagescontainer'

const Messageinbox = () => {

    const { x1, x2 } = useParams()

    const [allrequest, setAllrequest] = useState([])

    useEffect(() => {
        const requestCollectionRef = collection(db, 'Request');
        const q = query(requestCollectionRef, orderBy('friendRequests'))
        onSnapshot(q, (snapshot) => {
            const req = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAllrequest(req)
        })
    }, [x1, x2]);

    let ExtractedObjs = [];

    for (let i = 0; i < allrequest.length; i++) {
        const objcurrent = allrequest[i].friendRequests[0];
        const objnext = allrequest[i].friendRequests[1];

        const ExtractedObj = {
            id1: objcurrent.id1,
            id2: objnext.id2,
            status1: objcurrent.status,
            status2: objnext.status
        };

        ExtractedObjs.push(ExtractedObj);

    }

    const thisObject = ExtractedObjs.find(obj =>
        obj.id1 === x1 && obj.id2 === x2 || obj.id1 === x2 && obj.id2 === x1
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

    let allowMessages = true

    if (friendshipStatus === 'w' || friendshipStatus === undefined) {
        allowMessages = false
    } else if (friendshipStatus === 'x') {
        allowMessages = true
    } else if (friendshipStatus === 'y') {
        allowMessages = false
    } else if (friendshipStatus === 'z') {
        allowMessages = false
    }
    else {
        allowMessages = false
    }

    //console.log(x1, x2)

    return (
        <div className='Messageinbox'>
            <div className="Messageinbox-container">
                {allowMessages ?
                    <div className="allow-messages-container">

                        <Messagescontainer idreceiper={x1} />

                    </div>
                    :
                    <div className='Messageinbox-request-friend' >
                        <h5>Aun no puedes enviarle mensajes a esta persona</h5>
                        <h5>Enviale una solicitud de amistad</h5>
                        <Link to={`/singlesuser/${x1}`}>
                            <i className='bx bxs-user-plus'></i>
                        </Link>
                    </div>
                }
            </div>
        </div>
    )
}

export default Messageinbox