import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import './Displaychat.css'
import useSetMsgTimer from '../../../hooks/useSetMsgTimer';

const Displaychat = ({ newMessage, reloadMsg, idreceiper, ideSender }) => {

    const [user] = useAuthState(auth);
    const [allmsg, setAllmsg] = useState();
    const {timer}=useSetMsgTimer()

    useEffect(() => {
        const messagesRef = collection(db, 'Messages')
        const q = query(messagesRef, orderBy('message'))
        onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAllmsg(msgs)
        })
    }, [reloadMsg]);

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

    const thisChat = userMsgs?.filter((data) => {
        if (data.message[0].receptor === idreceiper && data.message[0].sender === ideSender || data.message[0].receptor === ideSender && data.message[0].sender === idreceiper) {
            return data
        }
    })

    const functionTest = (x) => {
    console.log(x);
    const lastTime = timer[0].data[timer[0].data.length - 1].time.toDate();
    const formattedTime = lastTime.getHours() + ":" + lastTime.getMinutes() + ":" + lastTime.getSeconds();
    console.log(formattedTime);
};
    //console.log(thisChat[0].message[3].sender === user.uid)

    return (
        <div className="display-chat">
            {thisChat &&
                thisChat.map((chat, i) => (
                    <div key={i} className="display-msg">
                        {chat.message.map((msg, j) => (
                            <div key={j} className="container-msg">
                                <p className={msg.sender === user.uid ? "display-msg-sender" : "display-msg-receptor"}>{msg.content}</p>
                                <div className={msg.sender === user.uid ? "display-time-sender" : "display-time-receptor"}>
                                    <h6>{`@${msg.userNameS}`}</h6>
                                    <h6>-</h6>
                                    <h6 onClick={msg.sender === user.uid ? functionTest('x') : functionTest(`${msg.createdAt.toDate().getHours()}:${msg.createdAt.toDate().getMinutes()}:${msg.createdAt.toDate().getSeconds()}`)} key={j + 1}>
                                        {`${msg.createdAt.toDate().getHours()}:${msg.createdAt.toDate().getMinutes()}:${msg.createdAt.toDate().getSeconds()}`}
                                    </h6>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            }
        </div>
    )
}

export default Displaychat