import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import './Messagescontainer.css'
import Singlemessage from './Singlemessage';
import { useAuthState } from 'react-firebase-hooks/auth';
import Cardmsg from './Chat/Cardmsg';

const Messagescontainer = ({ idreceiper }) => {

  const [openCloseSingleMessage, setOpenCloseSingleMessage] = useState(false)
  const [message, setMessage] = useState([]);
  const [thisUser] = useAuthState(auth)

  const functionOpenClose = (parameter) => {
    if (parameter) {
      setOpenCloseSingleMessage(!openCloseSingleMessage)
    } else {
      if (idreceiper === 'xxhxc') {
        setOpenCloseSingleMessage(false)
      } else {
        setOpenCloseSingleMessage(true)
      }
    }
  }

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
    functionOpenClose()
  }, [idreceiper]);


  return (
    <article className="Messagescontainer">
      {openCloseSingleMessage ?
        ''
        :
        <div className="Messagescontainer-all">
          <Cardmsg />
        </div>
      }
      {openCloseSingleMessage ?
        <div className="Messagescontainer-single-chat">
          <Singlemessage functionOpenClose={functionOpenClose} idreceiper={idreceiper} ideSender={thisUser.uid} />
        </div>
        :
        ''
      }
    </article>
  )
}

export default Messagescontainer