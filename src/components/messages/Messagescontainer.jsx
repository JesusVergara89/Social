import { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseConfig';
import './Messagescontainer.css'
import Singlemessage from './Singlemessage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const Messagescontainer = ({ idreceiper }) => {

  const [thisUser] = useAuthState(auth)
  const [timer, setTimer] = useState()

  useEffect(() => {
      const timerRef = collection(db, "timerMsg")
      const q2 = query(timerRef, orderBy("data"))
      onSnapshot(q2, (snapshot) => {
          const timers = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
          }))
          setTimer(timers)
      })
  }, []);
 
  const matchingObjects = timer?.map(obj => {
    const matchingData = obj.data.filter(item =>
        (item.creatorID === idreceiper && item.receptorID === thisUser.uid) ||
        (item.creatorID === thisUser.uid && item.receptorID === idreceiper)
    );
    return matchingData.length > 0 ? matchingData[matchingData.length - 1] : null;
});

const filteredMatchingObjects = matchingObjects?.filter(obj => obj !== null);

//console.log(filteredMatchingObjects)

  return (
    <article className="Messagescontainer">
      
        <div className="Messagescontainer-single-chat">
          <Singlemessage idreceiper={idreceiper} ideSender={thisUser.uid} />
        </div>
        
    </article>
  )
}

export default Messagescontainer