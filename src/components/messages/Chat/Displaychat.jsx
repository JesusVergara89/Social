import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import './Displaychat.css'

const Displaychat = ({ newMessage, reloadMsg, idreceiper, ideSender }) => {

    const [user] = useAuthState(auth);
    const [allmsg, setAllmsg] = useState();
    const [setshowPhoto, setSetshowPhoto] = useState(false)
    const [value, setValue] = useState('')

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

    const clickObject = document.getElementById("img-center");

    const EnlargeImage = (token) => {
        const match = token.match(/token=([a-zA-Z0-9-]+)/)
        if (match) {
            setSetEnlarge_Image((match[1]))
        } else {
            setSetEnlarge_Image('')
        }
        clickObject.scrollIntoView({ behavior: 'smooth' });
    }

    const ExtractToken = (url) => {
        const match = url.match(/token=([a-zA-Z0-9-]+)/)
        if (match) {
            return (match[1])
        } else {
            return ''; 
        }
        clickObject.scrollIntoView({ behavior: 'smooth' });
    }

    const thisChat = userMsgs?.filter((data) => {
        if (data.message[0].receptor === idreceiper && data.message[0].sender === ideSender || data.message[0].receptor === ideSender && data.message[0].sender === idreceiper) {
            return data
        }
    })

    const ShowPic = () => {
        setSetshowPhoto(!setshowPhoto)
    }

    const getPhotoRef = (ref) => {
        setValue(ref)
    }

    return (
        <div className="display-chat">
            <div className="display-chat-information">
                {thisChat &&
                    <div className={thisChat[0].message[Math.trunc(thisChat[0].message.length / 2)].receptor === user.uid ? "display-chat-information-profiles-reverse" : "display-chat-information-profiles"}>
                        <div className={thisChat[0].message[Math.trunc(thisChat[0].message.length / 2)].receptor === user.uid ? "display-chat-information-profiles-1-reverse" : "display-chat-information-profiles-1"}>
                            <img src={thisChat[0].message[Math.trunc(thisChat[0].message.length / 2)].photoR} alt="" />
                            <h5>@{thisChat[0].message[Math.trunc(thisChat[0].message.length / 2)].userNameR}</h5>
                        </div>
                        <div className={thisChat[0].message[Math.trunc(thisChat[0].message.length / 2)].receptor === user.uid ? "display-chat-information-profiles-2-reverse" : "display-chat-information-profiles-2"}>
                            <img src={thisChat[0].message[Math.trunc(thisChat[0].message.length / 2)].photoS} alt="" />
                            <h5>@{thisChat[0].message[Math.trunc(thisChat[0].message.length / 2)].userNameS}</h5>
                        </div>
                    </div>
                }
            </div>
            {setshowPhoto ? (
                <div className="display-chat-img-larger">
                    <div onClick={ShowPic} className="display-chat-img-larger-close">
                        <i className='bx bxs-x-circle'></i>
                    </div>
                    {
                        value ? 
                        <img src={value} alt="" />
                        :
                        <div className="loading-img">

                        </div>
                    }
                    
                </div>
            ) : (
                ''
            )}
            {thisChat &&
                thisChat.map((chat, i) => (
                    <div key={i} className={`display-msg ${setshowPhoto === true ? 'bluer-bg' : ''}`}>
                        {chat.message.map((msg, j) => (
                            <div key={j} className={(msg.imgUp && msg.imgUp !== null && msg.imgUp.length === 0) || msg.imgUp === "" ? "container-msg" : "container-msg-with-img"}>
                                <p className={msg.sender === user.uid ? "display-msg-sender" : "display-msg-receptor"}>{msg.content}</p>
                                {(msg.imgUp && msg.imgUp !== null && msg.imgUp.length !== 0) || msg.imgUp !== "" ? (
                                    <img onClick={() => { getPhotoRef(msg.imgUp); ShowPic() }} className={msg.sender === user.uid ? "display-time-sender" : "display-time-receptor"} src={msg.imgUp} alt="" />
                                ) : (
                                    null
                                )}
                                <div className={msg.sender === user.uid ? "display-time-sender" : "display-time-receptor"}>
                                    <h6>{`@${msg.userNameS}`}</h6>
                                    <h6>-</h6>
                                    <h6 key={j + 1}>
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