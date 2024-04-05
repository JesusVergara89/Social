import React, { useEffect, useState } from 'react';
import '../style/Conections.css';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const Conections = () => {
    const [allrequest, setAllrequest] = useState([]);
    const [myConections, setMyConections] = useState([]);
    const [usersall, setUsersall] = useState([]);
    const [userlog] = useAuthState(auth);

    useEffect(() => {
        const reqRef = collection(db, 'Users');
        const q = query(reqRef, orderBy('userName'));
        onSnapshot(q, (snapshot) => {
            const reqData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsersall(reqData);
        });

        const userRef = collection(db, 'Request');
        const q1 = query(userRef, orderBy('friendRequests'));
        onSnapshot(q1, (snapshot) => {
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllrequest(userData);
        });
    }, []);

    const myRequests = allrequest.filter((data, i) => {
        if ((data.friendRequests[0].id1 === userlog.uid || data.friendRequests[1].id2 === userlog.uid)
            && (data.friendRequests[0].status === true && data.friendRequests[1].status)) {
            return data.friendRequests
        }
    })

    const example = myRequests.map(data => data.friendRequests)

    //example[0][0].id1
    //example[0][1].id2
    //example[1][0].id1
    //example[1][1].id2

    const obtenerIds = (array) => {
        const ids = [];
        for (let i = 0; i < array.length; i++) {
          for (let j = 0; j < array[i].length; j++) {
            ids.push(array[i][j]['id' + (j + 1)]);
          }
        }
        return ids;
      }
      
      // Llamada a la función con tu array
      const ids = obtenerIds(example);
      const dataarray = ids.filter(data => {
        if(data !== userlog.uid){
            return data
        }
      })
      console.log(dataarray);
      

    //console.log(example)
     
    return (
        <div className="connections">
            hello
        </div>
    );
};

export default Conections;
