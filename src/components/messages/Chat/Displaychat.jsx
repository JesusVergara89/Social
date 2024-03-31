import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './Displaychat.css'

const Displaychat = ({ newMessage, reloadMsg, idreceiper, ideSender }) => {

    const [user] = useAuthState(auth);
    const [allmsg, setAllmsg] = useState();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Messages'));
                const documentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllmsg(documentsData);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
        };
        fetchDocuments();
    }, [reloadMsg, newMessage]);

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

    console.log(thisChat)

    return (
        <div className="display-chat">
            {thisChat &&
                thisChat.map((chat, i) => (
                    <div key={i} className="display-msg">
                        {chat.message.map((msg, j) => (
                            <div className='container-msg'>
                                <p className={msg.sender === user.uid ? "display-msg-sender" : "display-msg-receptor"} key={j}>{msg.content}</p>
                                <h6 className={msg.sender === user.uid ? "display-time-sender" : "display-time-receptor"} key={j + 1}>
                                    {`${msg.createdAt.toDate().getHours()}:${msg.createdAt.toDate().getMinutes()}:${msg.createdAt.toDate().getSeconds()}`}
                                </h6>
                            </div>
                        ))}
                    </div>
                ))
            }
        </div>
    )
}

export default Displaychat