import React, { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebaseConfig';
import './Displaychat.css'
import Emoji from './Emoji';
import Emojireactions from './Emojireactions';
import Emojireactionlarger from './Emojireactionlarger';
import { useNavigate } from 'react-router-dom';
import DisplaychatSkeleton from '../../Loading/DisplaychatSkeleton';

const Displaychat = ({ Message, recieve, filesImage }) => {
    const [user] = useAuthState(auth);
    const [setshowPhoto, setSetshowPhoto] = useState(false)
    const [value, setValue] = useState('')
    const [EMoji_Show, setEMoji_Show] = useState(false)
    const [indexInfo, setIndexInfo] = useState('')
    const [reaction, setReaction] = useState([])
    const [SkeletoLoading, setSkeletoLoading] = useState()
    const ScrollRef = useRef(null);
    useEffect(() => {
        setSkeletoLoading(undefined)
        const timer = setTimeout(() => {
            setSkeletoLoading(true)
        }, 500);
        return () => clearTimeout(timer);
    }, [recieve])
    const scrollToElement = () => {
        if (ScrollRef.current) {
            ScrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    useEffect(() => {
        scrollToElement()
    }, [SkeletoLoading, Message])


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

    const navigateToAllmsg = useNavigate()
    return (
        <div className={filesImage?.[0] ? "display-chat on" : "display-chat"}>
            {SkeletoLoading ?
                <>
                    <div className="display-chat-information">
                        <button onClick={() => navigateToAllmsg('/messagesinbox')} className='single-card-msg-close'><i class='bx bx-left-arrow-alt' /></button>
                        <img src={recieve?.photo} alt="Foto de perfil Amigo" />
                        <h4>{`@${recieve?.userName}`}</h4>
                    </div>
                    {Message ?
                        <div className='display-chat-messages'>
                            {Message.message.map((msg, j) => (
                                <div key={j} className={(msg.imgUp && msg.imgUp[0] !== '') ? "container-msg-with-img" : "container-msg"}>
                                    {msg.content === '' ? '' : <p className={msg.sender === user.uid ? "display-msg-sender" : "display-msg-receptor"}>{msg.content}</p>}
                                    {msg.imgUp && msg.imgUp[0] !== '' ? (
                                        <div className={msg.sender === user.uid ? "container-msg-with-img-emojis" : "container-msg-with-img-emojis receptor"}>
                                            <img onClick={() => { getPhotoRef(msg.imgUp[0], msg.imgUp[1].emojisREACT); ShowPic() }} src={msg.imgUp[0]} alt="" />
                                            <Emojireactions user={user} msg={msg} />
                                            <i onClick={() => { EMojiShow(j) }} className={msg.sender === user.uid ? 'bx bxs-plus-circle sender' : 'bx bxs-plus-circle receptor'}></i>
                                            <Emoji id={Message.id} EMoji_Show={EMoji_Show} indexInfo={indexInfo} j={j} msg={msg} user={user} />
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
                                        {msg.sender === user.uid ?
                                            msg.showNotice === true ? <i className='bx bx-check-double' style={msg.showMessage === true ? { color: '#0095f6' } : { color: 'black' }} /> : msg.showMessage === false ? <i class='bx bx-check' /> : ''
                                            : ''}
                                    </div>
                                </div>
                            ))
                            }
                            <div className='prueba' ref={ScrollRef} />
                        </div>
                        :
                        <div className='noneMensage'>
                            <p>Aun no hay mensajes...</p>
                            <p>Envía un mensaje 😊</p>
                        </div>}
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