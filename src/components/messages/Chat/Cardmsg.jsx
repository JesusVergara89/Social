import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Cardmsg.css'
import { Link } from 'react-router-dom';
import useSetMsgTimer from '../../../hooks/useSetMsgTimer';

const Cardmsg = () => {

    const [user] = useAuthState(auth);
    const [allmsg, setAllmsg] = useState();
    const { timer, myTimes } = useSetMsgTimer(user)
    const [lastAll, setLastall] = useState();

    useEffect(() => {
        const querySnapshot = collection(db, 'Messages');
        const q = query(querySnapshot, orderBy('message'))
        onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAllmsg(msgs)
        })
        const lasRef = collection(db, 'lasMsg')
        const q1 = query(lasRef, orderBy('data'))
        onSnapshot(q1, (snapshot) => {
            const last = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setLastall(last)
        })
    }, []);

    const userMsgs = allmsg?.filter(data => {
        if (Array.isArray(data.message) && data.message.length > 0) {
            for (let i = 0; i < data.message.length; i++) {
                if (data.message[i].sender === user.uid || data.message[i].receptor === user.uid) {
                    return true;
                }
            }
        }
        return false;
    });

    const testFunction = (IDuserR, IDuserS, userNameR, userNameS) => {
        myTimes(IDuserR, IDuserS,userNameR,userNameS)
        //console.log(user.uid)
    }

    return (
        <div className="card-msg">
            { lastAll && lastAll.map((last,i)=>{
                
            })

            }
            <h3 className='card-msg-title'>tus mensajes con otros usuarios:</h3>
            {userMsgs && userMsgs.map((msg, i) => (
                <Link key={i + 1} to={msg.message[0].receptor === user.uid ? `/Sendmessage/${msg.message[0].sender}/${user.uid}` : `/Sendmessage/${msg.message[0].receptor}/${user.uid}`}>
                    <div onClick={() => { testFunction(msg.message[0].receptor, msg.message[0].sender,msg.message[0].userNameR,msg.message[0].userNameS) }} key={i} className='card-msg-info'>
                        <div className="card-user1">
                            <img src={msg.message[0].photoR} alt="" />
                            <h4>{`@${msg.message[0].userNameR}`}</h4>
                        </div>
                        <div className="card-user1">
                            <img src={msg.message[0].photoS} alt="" />
                            <h4>{`@${msg.message[0].userNameS}`}</h4>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Cardmsg;
