import React, { useEffect, useState } from 'react'
import './Messageinbox.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import Messagescontainer from './Messagescontainer'

const Messageinbox = () => {

    const { x1, x2 } = useParams()

    const [allrequest, setAllrequest] = useState([])
    const [goMessages, setGoMessages] = useState(true)

    useEffect(() => {
        const requestCollectionRef = collection(db, 'Request');
        getDocs(requestCollectionRef)
            .then((querySnapshot) => {
                const requests = querySnapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() };
                });
                setAllrequest(requests);
            })
            .catch((error) => {
                console.error("Error fetching documents: ", error);
            });
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
        obj.id1 === x1 && obj.id2 === x2
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

    const allowSendMessages = () => setGoMessages(!goMessages)

    ///console.log(allowMessages)

    return (
        <div className='Messageinbox'>
            <div className={goMessages ? "Messageinbox-container" : ''}>
                {allowMessages ?
                    <div className="allow-messages-container">
                        {goMessages ?
                            <button onClick={allowSendMessages}>hello</button>
                            :
                            <Messagescontainer idreceiper={x1} />
                        }
                    </div>
                    :
                    <div>
                        <h5>Aun no puedes enviarle mensajes a esta persona</h5>
                        <h5>Enviale una solicitud de amistad primero</h5>
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