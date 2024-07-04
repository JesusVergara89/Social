import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Cardmsg.css'
import { Link } from 'react-router-dom';
import useSetMsgTimer from '../../../hooks/useSetMsgTimer';
import { CurrentUsercontext } from '../../Context/CurrentUsercontext';
import CardmsgSkeleton from '../../Loading/CardmsgSkeleton';

const Cardmsg = ({ idreceiper }) => {

    const [user] = useAuthState(auth);
    const [allmsg, setAllmsg] = useState();
    const [timer, setTimer] = useState([])
    const [msjNotification, setMsjNotification] = useState([])
    const { times, myTimes } = useSetMsgTimer(user)

    useEffect(() => {
        setAllmsg(undefined)
        const querySnapshot = collection(db, 'Messages');
        const q = query(querySnapshot, orderBy('message'))
        onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAllmsg(msgs)
        })
        const timerRef = collection(db, 'timerMsg');
        const q1 = query(timerRef, orderBy('data'))
        onSnapshot(q1, (snapshot) => {
            const timers = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setTimer(timers)
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

    useEffect(() => {
        if (user) {
            const newMsjNotification = [];
            for (const obj of timer) {
                const filteredData = obj?.data?.filter(item =>
                    item.creatorID === user.uid || item.receptorID === user.uid
                );
                if (filteredData.length > 0) {
                    const lastObject = filteredData[filteredData.length - 1];
                    if (lastObject.receptorID === user.uid && lastObject.userNameR !== '' && lastObject.userNameS !== '') {
                        newMsjNotification.push(lastObject);
                    }
                }
            }
            setMsjNotification(newMsjNotification);
        }
    }, [timer, user, setMsjNotification]);

    const testFunction = (IDuserR, IDuserS, userNameR, userNameS) => {
        myTimes(IDuserR, IDuserS, userNameR, userNameS)
    }
    const { CurrentUser } = useContext(CurrentUsercontext)
    const InformationMessage = (Message) => {
        return (
            <p>
                {Message.userNameS === CurrentUser.userName ? 'Tú: ' : ''}{Message.imgUp ? <i className='bx bxs-image-alt' /> : ''}{Message.content != '' ? Message.content : 'Foto'}
            </p>)
    }
    return (
        <div className="card-msg">
            <h3 className={msjNotification.length > 0 ? 'card-msg-title' : 'card-msg-title-none'}>Mensajes recientes:</h3>
            <div className={msjNotification.length > 0 ? 'card-msg-newsms' : 'card-msg-newsms-none'}>
                {msjNotification.length > 0 ?
                    msjNotification.map((data, i) => (
                        <div key={i} className="card-msg-newsms-sms">
                            <h4>Tienes mensajes nuevos de:</h4>
                            <h4><span>@{data.userNameS}</span></h4>
                        </div>
                    ))
                    :
                    ''
                }
            </div>
            <div className='List-friends'>
                <h3 className='card-msg-title'>Mensajes con otros Usuarios</h3>
                {allmsg ? userMsgs.map((msg, i) => (
                    <Link key={i + 1} to={msg.message[0].receptor === user.uid ? `/Sendmessage/${msg.message[0].sender}/${user.uid}` : `/Sendmessage/${msg.message[0].receptor}/${user.uid}`}>
                        <div onClick={() => testFunction(msg.message[0].receptor, msg.message[0].sender, '', '')} key={i} className={msg.message[0].receptor === idreceiper || msg.message[0].sender === idreceiper ? 'card-msg-info on' : 'card-msg-info'}>
                            <div className="card-user1">
                                <img src={msg.message[0].userNameR === CurrentUser.userName ? msg.message[0].photoS : msg.message[0].photoR} alt="Foto de perfil Amigo" />
                                <div className='card-user-information'>
                                    <h4>{`@${msg.message[0].userNameR === CurrentUser.userName ? msg.message[0].userNameS : msg.message[0].userNameR}`}</h4>
                                    {InformationMessage(msg.message[msg.message.length - 1])}
                                </div>
                            </div>
                        </div >
                    </Link >
                )) : <CardmsgSkeleton />}
            </div>
        </div >
    );
};

export default Cardmsg;
