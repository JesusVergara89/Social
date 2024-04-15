import React, { useEffect, useState } from 'react';
import './Singlemessage.css';
import { addDoc, collection, updateDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import Displaychat from './Chat/Displaychat';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMsgValue } from '../../store/slices/countermsg.slice';
import useSetMsgTimer from '../../hooks/useSetMsgTimer';
import { useAuthState } from 'react-firebase-hooks/auth';

const Singlemessage = ({ idreceiper, ideSender }) => {

    const [userOnline]=useAuthState(auth)
    const [messages, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [Allusers, setAllusers] = useState([])
    const [reloadMsg, setReloadMsg] = useState(false)
    const [textareaHeight, setTextareaHeight] = useState('30px');
    const [userChangePosition, setUserChangePosition] = useState(null)
    const dispatch = useDispatch()
    const setMesgValue = (value) => dispatch(setMsgValue(value));
    const { timer, myTimes } = useSetMsgTimer(userOnline)

    const navigateToAllmsg = useNavigate()

    useEffect(() => {
        const querySnapshot = collection(db, 'Messages');
        const q = query(querySnapshot, orderBy('message'))
        onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setMessage(msgs);
        })

        const usersCollectionRef = collection(db, 'Users');
        const q1 = query(usersCollectionRef, orderBy('userName'))
        onSnapshot(q1, (snapshot) => {
            const userx = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAllusers(userx);
        })
    }, [idreceiper, ideSender, reloadMsg, newMessage]);

    useEffect(() => {
        const adjustTextareaHeight = () => {
            const length = newMessage.length;
            const minHeight = 30;
            const maxHeight = 300;
            const step = 30;

            let height = minHeight + Math.floor(length / 30) * step;
            height = Math.min(height, maxHeight);
            setTextareaHeight(height + 'px');
        };
        adjustTextareaHeight();
    }, [newMessage]);

    const arrayMessagesToUpdate = messages.filter(data => {
        return (data.message[0].receptor === idreceiper && data.message[0].sender === ideSender) || (data.message[0].receptor === ideSender && data.message[0].sender === idreceiper);
    });

    const myMessages = Allusers.filter((match) => {
        if (match.idUser === idreceiper || match.idUser === ideSender) {
            return match
        }
    }
    )

    const changePosition = (array, uid) => {
        const index = array.findIndex(objeto => objeto.idUser === uid);
        const objeto = array.splice(index, 1)[0];
        array.unshift(objeto);

        return array;
    }

    useEffect(() => {
        setUserChangePosition(changePosition(myMessages, idreceiper))
        console.log()
    }, [newMessage])

    const functionReload = () => setReloadMsg(!reloadMsg)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let updatedMessages;
            if (arrayMessagesToUpdate.length > 0) {
                updatedMessages = [...arrayMessagesToUpdate[0].message];
                updatedMessages.push({
                    content: newMessage,
                    createdAt: new Date(),
                    receptor: idreceiper,
                    sender: ideSender,
                    userNameR: userChangePosition[0].userName,
                    userNameS: userChangePosition[1].userName,
                    photoR: userChangePosition[0].photo,
                    photoS: userChangePosition[1].photo
                });
                const messageId = arrayMessagesToUpdate[0].id;
                const messageRef = doc(db, 'Messages', messageId);
                await updateDoc(messageRef, { message: updatedMessages });
                myTimes(ideSender,idreceiper,userChangePosition[0].userName,userChangePosition[1].userName)
            } else {
                const newPost = {
                    message: [
                        {
                            content: newMessage,
                            createdAt: new Date(),
                            receptor: idreceiper,
                            sender: ideSender,
                            userNameR: userChangePosition[0].userName,
                            userNameS: userChangePosition[1].userName,
                            photoR: userChangePosition[0].photo,
                            photoS: userChangePosition[1].photo
                        }
                    ]
                };
                const postRef = collection(db, 'Messages');
                await addDoc(postRef, newPost);
                myTimes(ideSender,idreceiper,userChangePosition[0].userName,userChangePosition[1].userName)
            }
            setNewMessage('');
            toast('Message send', { type: 'success' });
        } catch (error) {
            console.log(error);
            toast('Error request', { type: 'error' });
        }
    }

    //console.log(userChangePosition)

    if (myMessages.length === 0) {
        return null;
    }

    const functionImIn = () => {
        setMesgValue(0)
        console.log('hello')
    }

    return (
        <div className='single-card-msg'>
            <button onClick={() => navigateToAllmsg('/messagesinbox')} className='single-card-msg-close'><i className='bx bxs-x-circle'></i></button>
            <div className="card-msg-one-one">
                {arrayMessagesToUpdate.length === 0 &&
                    <div className="new-chat">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                placeholder='Escribe tu mensaje...'
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{ height: textareaHeight }}
                                rows={1}
                            />
                            <button onClick={() => { functionReload(); functionImIn() }} type='submit'>Enviar</button>
                        </form>
                    </div>
                }
                {arrayMessagesToUpdate.length > 0 &&
                    <div className="card-msg-one-one">
                        <Displaychat newMessage={newMessage} reloadMsg={reloadMsg} idreceiper={idreceiper} ideSender={ideSender} />
                        <form onSubmit={handleSubmit}>
                            <textarea
                                placeholder='Escribe tu mensaje...'
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{ height: textareaHeight }}
                                rows={1}
                            />
                            <button onClick={() => { functionReload(); functionImIn() }} type='submit'>Enviar</button>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}

export default Singlemessage;
