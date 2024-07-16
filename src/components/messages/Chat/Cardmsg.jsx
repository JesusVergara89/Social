import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Cardmsg.css'
import { Link } from 'react-router-dom';
import { CurrentUsercontext } from '../../Context/CurrentUsercontext';
import CardmsgSkeleton from '../../Loading/CardmsgSkeleton';
import useConnections from '../../../hooks/useConnections';

const Cardmsg = ({ idreceiper }) => {

    const [user] = useAuthState(auth);
    const [allmsg, setAllmsg] = useState();
    const [timer, setTimer] = useState([])
    const { findFriends } = useConnections()

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

    let FindChat = []
    findFriends?.map(dataFriend => {
        let idUser = dataFriend.idUser
        let AddData
        let dataChat = userMsgs?.find((e) => e.message[0].receptor === idUser || e.message[0].sender === idUser)
        dataChat ?
            AddData = {
                idUser: dataFriend.idUser,
                userName: dataFriend.userName,
                photo: dataFriend.photo,
                message: dataChat.message
            }
            : AddData = {
                idUser: dataFriend.idUser,
                userName: dataFriend.userName,
                photo: dataFriend.photo
            }
        FindChat.push(AddData)
    })

    const { CurrentUser } = useContext(CurrentUsercontext)
    const CountMessage = (msg) => {
        let count = msg.message?.filter(item => item.receptor === user.uid && item.showMessage === false).length
        return count
    }
    const InformationMessage = (Message, msg) => {
        return (
            <div className={Message.receptor === user.uid && Message.showMessage === false ? 'view on' : 'view'}>
                <p>
                    {Message.userNameS === CurrentUser?.userName ?
                        Message.showNotice === true ? <i className='bx bx-check-double' style={Message.showMessage === true ? { color: '#0095f6' } : { color: 'black' }} /> : Message.showMessage === false ? <i class='bx bx-check' /> : ''
                        : ''}{Message.imgUp ? <i className='bx bxs-image-alt' /> : ''}{Message.content != '' ? Message.content : 'Foto'}
                </p>
                <div className='counter'>
                    <h6>{CountMessage(msg)}</h6>
                </div>
            </div>
        )
    }
    return (
        <div className="card-msg">
            <div className='List-friends'>
                <h3 className='card-msg-title'>Mensajes con otros Usuarios</h3>
                {allmsg ? FindChat.map((msg, i) => (
                    <Link key={i} to={`/Sendmessage/${msg.idUser}`}>
                        <div className={msg.idUser === idreceiper ? 'card-user1 on' : 'card-user1'}>
                            <img src={msg.photo} alt="Foto de perfil Amigo" />
                            <div className='card-user-information'>
                                <h4>{`@${msg.userName}`}</h4>
                                {msg.message && InformationMessage(msg.message[msg.message.length - 1], msg)}
                            </div>
                        </div>
                    </Link >
                )) : <CardmsgSkeleton />}
            </div>
        </div >
    );
};

export default Cardmsg;
