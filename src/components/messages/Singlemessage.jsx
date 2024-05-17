import React, { useEffect, useState } from 'react';
import './Singlemessage.css';
import { addDoc, collection, updateDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db, storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import Displaychat from './Chat/Displaychat';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useSetMsgTimer from '../../hooks/useSetMsgTimer';
import { useAuthState } from 'react-firebase-hooks/auth';

const Singlemessage = ({ idreceiper, ideSender }) => {

    const [userOnline] = useAuthState(auth)
    const [messages, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [Allusers, setAllusers] = useState([])
    const [reloadMsg, setReloadMsg] = useState(false)
    const [imgUPto, setImgUPto] = useState('');
    const [textareaHeight, setTextareaHeight] = useState('30px');
    const [userChangePosition, setUserChangePosition] = useState(null)
    const { timer, myTimes } = useSetMsgTimer(userOnline)
    const msgNotification = useSelector(state => state.countermsg);

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
            const lenthLine = (newMessage.split('\n').length - 1) * 30
            const minHeight = 30;
            const maxHeight = 100;
            const step = 20;

            let height = minHeight + Math.floor((length + lenthLine) / 30) * step;
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
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setImgUPto(file);
    };

    const changePosition = (array, uid) => {
        const index = array.findIndex(objeto => objeto.idUser === uid);
        const objeto = array.splice(index, 1)[0];
        array.unshift(objeto);

        return array;
    }

    useEffect(() => {
        setUserChangePosition(changePosition(myMessages, idreceiper))
    }, [newMessage, imgUPto])

    const functionReload = () => setReloadMsg(!reloadMsg)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let updatedMessages;
            let imageUrls = '';

            if (imgUPto) {
                const photoRef = `/images/${Date.now()}${imgUPto.name}`;
                const storageRef = ref(storage, photoRef);
                await uploadBytes(storageRef, imgUPto);
                const downloadUrl = await getDownloadURL(storageRef);
                imageUrls = downloadUrl;
            }

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
                    photoS: userChangePosition[1].photo,
                    imgUp:
                        [imageUrls,
                            {
                                emojisDB: ["🌱", "🌿", "🌳", "🌍", "🌻", "🌎", "🌲", "🍃", "🌞", "🌊", "🌸", "🍀", "🌾", "🌵", "🌼", "🐝", "🦋", "🐞", "🐢", "🌴", "😊", "👍", "👎", "🎉", "🙏", "🤣", "❤️", "😍", "😎", "😜", "😇", "😂", "😘", "😁", "🤩", "😋", "😴", "🤗", "🤔", "😕"],
                                emojisREACT: []
                            }
                        ]
                });
                const messageId = arrayMessagesToUpdate[0].id;
                const messageRef = doc(db, 'Messages', messageId);
                await updateDoc(messageRef, { message: updatedMessages });
                myTimes(ideSender, idreceiper, userChangePosition[0].userName, userChangePosition[1].userName)
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
                            photoS: userChangePosition[1].photo,
                            imgUp:
                                [imageUrls,
                                    {
                                        emojisDB: ["🌱", "🌿", "🌳", "🌍", "🌻", "🌎", "🌲", "🍃", "🌞", "🌊", "🌸", "🍀", "🌾", "🌵", "🌼", "🐝", "🦋", "🐞", "🐢", "🌴", "😊", "👍", "👎", "🎉", "🙏", "🤣", "❤️", "😍", "😎", "😜", "😇", "😂", "😘", "😁", "🤩", "😋", "😴", "🤗", "🤔", "😕"],
                                        emojisREACT: []
                                    }
                                ]
                        }
                    ]
                };
                const postRef = collection(db, 'Messages');
                await addDoc(postRef, newPost);
                myTimes(ideSender, idreceiper, userChangePosition[0].userName, userChangePosition[1].userName)
            }
            setNewMessage('');
            setImgUPto('')
            toast('Message send', { type: 'success' });
        } catch (error) {
            console.log(error);
            toast('Error request', { type: 'error' });
        }
    }

    if (myMessages.length === 0) {
        return null;
    }

    const testFunction = (IDuserR, IDuserS, userNameR, userNameS) => {
        myTimes(IDuserR, IDuserS, userNameR, userNameS)
    }

    return (
        <div className='single-card-msg'>
            {msgNotification[0] === 1 &&
                ((msgNotification[1][0] === idreceiper || msgNotification[1][0] === ideSender) &&
                    (msgNotification[1][1] === idreceiper || msgNotification[1][1] === ideSender)) ?
                <button onClick={() => testFunction(idreceiper, ideSender, '', '')} className='message-read'>Marcar como leído</button> :
                ''
            }
            <button onClick={() => navigateToAllmsg('/messagesinbox')} className='single-card-msg-close'><i className='bx bxs-x-circle'></i></button>
            <div className="card-msg-one-one">
                {arrayMessagesToUpdate.length === 0 &&
                    <div className="new-chat">
                        <form onSubmit={handleSubmit}>
                            <div className="card-msg-one-one-form">
                                <textarea
                                    placeholder='Escribe tu mensaje...'
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{ height: textareaHeight }}
                                    rows={1}
                                />
                                <label className="file-input-label">
                                    <input
                                        type="file"
                                        name={`image`}
                                        accept="image/*"
                                        onChange={(e) => handlePhotoChange(e)}
                                        style={{ display: 'none' }}
                                    />
                                    <i className='bx bxs-image-alt'></i>
                                </label>
                            </div>
                            <button onClick={() => { functionReload() }} type='submit'>Enviar</button>
                        </form>
                    </div>
                }
                {arrayMessagesToUpdate.length > 0 &&
                    <>
                        <Displaychat newMessage={newMessage} reloadMsg={reloadMsg} idreceiper={idreceiper} ideSender={ideSender} />
                        <form onSubmit={handleSubmit}>
                            <div className="card-msg-one-one-form">
                                <textarea
                                    placeholder='Escribe tu mensaje...'
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{ height: textareaHeight }}
                                    rows={1}
                                />
                                <label className="file-input-label">
                                    <input
                                        type="file"
                                        name={`image`}
                                        accept="image/*"
                                        onChange={(e) => handlePhotoChange(e)}
                                        style={{ display: 'none' }}
                                    />
                                    <i className='bx bxs-image-alt'></i>
                                </label>
                            </div>
                            <button onClick={() => { functionReload() }} type='submit'>Enviar</button>
                        </form>
                    </>
                }
            </div>
        </div>
    )
}

export default Singlemessage;
