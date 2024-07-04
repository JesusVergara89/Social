import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import './Displaychat.css'
import Emoji from './Emoji';
import Emojireactions from './Emojireactions';
import Emojireactionlarger from './Emojireactionlarger';
import { CurrentUsercontext } from '../../Context/CurrentUsercontext';
import { useNavigate } from 'react-router-dom';
import DisplaychatSkeleton from '../../Loading/DisplaychatSkeleton';

const Displaychat = ({ newMessage, reloadMsg, idreceiper, ideSender }) => {

    const [user] = useAuthState(auth);
    const [allmsg, setAllmsg] = useState();
    const [setshowPhoto, setSetshowPhoto] = useState(false)
    const [value, setValue] = useState('')
    const [EMoji_Show, setEMoji_Show] = useState(false)
    const [indexInfo, setIndexInfo] = useState('')
    const [reaction, setReaction] = useState([])
    const [SkeletoLoading, setSkeletoLoading] = useState()

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
        console.log('entre')
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
    let ThisChatDes = thisChat?.[0]
    useEffect(() => {
        setSkeletoLoading(undefined)
        const timer = setTimeout(() => {
            setSkeletoLoading(true)
        }, 500);
        return () => clearTimeout(timer);
    }, [idreceiper, ideSender])

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
    const { CurrentUser } = useContext(CurrentUsercontext)
    const navigateToAllmsg = useNavigate()
    return (
        <div className="display-chat">

            {SkeletoLoading ?
                <>
                    <div className="display-chat-information">
                        <button onClick={() => navigateToAllmsg('/messagesinbox')} className='single-card-msg-close'><i class='bx bx-left-arrow-alt' /></button>
                        <img src={ThisChatDes.message[0].userNameR === CurrentUser.userName ? ThisChatDes.message[0].photoS : ThisChatDes.message[0].photoR} alt="Foto de perfil Amigo" />
                        <h4>{`@${ThisChatDes.message[0].userNameR === CurrentUser.userName ? ThisChatDes.message[0].userNameS : ThisChatDes.message[0].userNameR}`}</h4>
                    </div>
                    <div className='display-chat-messages'>
                        {ThisChatDes &&
                            ThisChatDes.message.map((msg, j) => (
                                <div key={j} className={(msg.imgUp && msg.imgUp[0] !== '') ? "container-msg-with-img" : "container-msg"}>
                                    {msg.content === '' ? '' : <p className={msg.sender === user.uid ? "display-msg-sender" : "display-msg-receptor"}>{msg.content}</p>}
                                    {msg.imgUp && msg.imgUp[0] !== '' ? (
                                        <div className={msg.sender === user.uid ? "container-msg-with-img-emojis" : "container-msg-with-img-emojis receptor"}>
                                            <img onClick={() => { getPhotoRef(msg.imgUp[0], msg.imgUp[1].emojisREACT); ShowPic() }} src={msg.imgUp[0]} alt="" />
                                            <Emojireactions user={user} msg={msg} />
                                            <i onClick={() => { EMojiShow(j) }} className={msg.sender === user.uid ? 'bx bxs-plus-circle sender' : 'bx bxs-plus-circle receptor'}></i>
                                            <Emoji id={ThisChatDes.id} EMoji_Show={EMoji_Show} indexInfo={indexInfo} j={j} msg={msg} user={user} />
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
                            ))
                        }
                    </div>
                </> : <DisplaychatSkeleton />}
            {setshowPhoto && (
                <div className="display-chat-img-larger">
                    <i className='bx bx-x' onClick={ShowPic} />
                    <img src={value} alt="" />
                    <Emojireactionlarger reaction={reaction} />
                </div>
            )}
            <div className={setshowPhoto ? 'ClosePhoto on' : 'ClosePhoto'} onClick={() => setSetshowPhoto(false)} />

        </div>
    )
}

export default Displaychat