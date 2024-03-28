import React, { useEffect, useState } from 'react'
import './Sendmessage.css'
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const Sendmessage = () => {

    const [message, setMessage] = useState([]);

    useEffect(() => {
      const fetchDocuments = async () => {
          try {
              const querySnapshot = await getDocs(collection(db, 'Messages'));
              const documentsData = querySnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
              }));
              setMessage(documentsData);
          } catch (error) {
              console.error('Error fetching documents: ', error);
          }
      };
      fetchDocuments();
  }, []);

    console.log(message)

  return (
    <div>Sendmessage</div>
  )
}

export default Sendmessage