import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import './Messagescontainer.css'

const Messagescontainer = ({idreceiper}) => {

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
  
    //console.log(message)
  return (
    <article className="Messagescontainer">
        {`Hello ${idreceiper}`}
    </article>
  )
}

export default Messagescontainer