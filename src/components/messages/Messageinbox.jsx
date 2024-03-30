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
    }, []);


    return (
        <div className='Messageinbox'>
            <h2>{`Messageinbox: ${x1} y ${x2}`}</h2>
        </div>
    )
}

export default Messageinbox