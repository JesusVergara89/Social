import React, { useEffect, useState } from 'react'
import './Messageinbox.css'
import { useParams } from 'react-router-dom'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

const Messageinbox = () => {

    const { x1, x2 } = useParams()

    const [allrequest, setAllrequest] = useState([])
    const [confirmation, setConfirmation] = useState('')

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

    let objetosExtraidos = [];

    for (let i = 0; i < allrequest.length; i++) {
        const objActual = allrequest[i].friendRequests[0];
        const objSiguiente = allrequest[i].friendRequests[1];

        const objetoExtraido = {
            id1: objActual.id1,
            id2: objSiguiente.id2,
            status1: objActual.status,
            status2: objSiguiente.status
        };

        objetosExtraidos.push(objetoExtraido);

    }

    const objetoDeseado = objetosExtraidos.find(objeto =>
        objeto.id1 === x1 && objeto.id2 === x2
    );

    console.log(objetoDeseado)

    return (
        <div className='Messageinbox'>
            <h2>{`objetoDeseado Messageinbox: ${x1} y ${x2}`}</h2>
        </div>
    )
}

export default Messageinbox