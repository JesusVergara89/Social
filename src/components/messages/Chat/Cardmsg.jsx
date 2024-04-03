import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Cardmsg.css'
import { Link } from 'react-router-dom';

const Cardmsg = () => {

    const [user] = useAuthState(auth);
    const [allmsg, setAllmsg] = useState();

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

    //console.log(userMsgs)

    return (
        <div className="card-msg">
            <h3 className='card-msg-title'>tus mensajes con otros usuarios:</h3>
            {userMsgs && userMsgs.map((msg, i) => (
                <Link key={i + 1} to={msg.message[0].receptor === user.uid ? `/Sendmessage/${msg.message[0].sender}/${user.uid}` : `/Sendmessage/${msg.message[0].receptor}/${user.uid}`}>
                    <div key={i} className='card-msg-info'>
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
