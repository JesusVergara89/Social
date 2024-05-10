import React, { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import './Displaychat.css'
import Emoji from './Emoji';

const Displaychat = ({ newMessage, reloadMsg, idreceiper, ideSender }) => {

    const [user] = useAuthState(auth);
    const [allmsg, setAllmsg] = useState();
    const [setshowPhoto, setSetshowPhoto] = useState(false)
    const [value, setValue] = useState('')
    const [EMoji_Show, setEMoji_Show] = useState(false)
    const [indexInfo, setIndexInfo] = useState('')
    const [reaction, setReaction] = useState([])

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

    const ShowPic = () => {
        setSetshowPhoto(!setshowPhoto)
        setEMoji_Show(false)
    }

    const getPhotoRef = (ref, emojiReact) => {
        setValue(ref)
        setReaction(emojiReact)
    }

    const EMojiShow = (index) => {
        setSetshowPhoto(false)
        setEMoji_Show(!EMoji_Show)
        setIndexInfo(index)
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
                    <img src={value} alt="" />
                </div>
            ) : (
                ''
            )}
            {thisChat &&
                thisChat.map((chat, i) => (
                    <div key={i} className={`display-msg ${setshowPhoto === true ? 'bluer-bg' : ''}`}>
                        {chat.message.map((msg, j) => (
                            <div key={j} className={(msg.imgUp && msg.imgUp[0] !== '') ? "container-msg-with-img" : "container-msg"}>
                                {msg.content === '' ? '' : <p className={msg.sender === user.uid ? "display-msg-sender" : "display-msg-receptor"}>{msg.content}</p>}
                                {msg.imgUp && msg.imgUp[0] !== '' ? (
                                    <div className="container-msg-with-img-emojis">
                                        <img onClick={() => { getPhotoRef(msg.imgUp[0], msg.imgUp[1].emojisREACT); ShowPic() }} className={msg.sender === user.uid ? "display-time-sender" : "display-time-receptor"} src={msg.imgUp[0]} alt="" />
                                        <div className={msg.sender === user.uid ? "container-msg-with-img-emojis-reaction-sender" : "container-msg-with-img-emojis-reaction-receptor"} >
                                            {
                                                msg.imgUp[1].emojisREACT.map((data, i) => (
                                                    <i key={i}>{data}</i>
                                                ))
                                            }
                                        </div>
                                        <i onClick={() => { EMojiShow(j) }} className={msg.sender === user.uid ? 'bx bxs-plus-circle sender' : 'bx bxs-plus-circle receptor'}></i>
                                        <Emoji EMoji_Show={EMoji_Show} indexInfo={indexInfo} j={j} msg={msg} user={user} />
                                    </div>
                                ) : (
                                    null
                                )}
                                <div className={msg.sender === user.uid ? `display-time-sender ${msg.content === '' ? 'off-time' : ''}` : `display-time-receptor ${msg.content === '' ? 'off-time' : ''}`}>
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