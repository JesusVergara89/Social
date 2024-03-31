import React, { useEffect, useState } from 'react';
import './Singlemessage.css';
import { addDoc, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import Displaychat from './Chat/Displaychat';

const Singlemessage = ({ functionOpenClose, idreceiper, ideSender }) => {

    const [messages, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [Allusers, setAllusers] = useState([])
    const [reloadMsg, setReloadMsg] = useState(false)

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Messages'));
                const documentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessage(documentsData);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
        };
        const getUsers = async () => {
            try {
                const usersCollectionRef = collection(db, 'Users');
                const usersSnapshot = await getDocs(usersCollectionRef);
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllusers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        getUsers();
        fetchDocuments();
    }, [idreceiper, ideSender,reloadMsg,newMessage]);

    const arrayMessagesToUpdate = messages.filter(data => {
        return (data.message[0].receptor === idreceiper && data.message[0].sender === ideSender) || (data.message[0].receptor === ideSender && data.message[0].sender === idreceiper);
    });

    const myMessages = Allusers.filter((match) => {
        if (match.idUser === idreceiper || match.idUser === ideSender) {
            return match
        }
    }
    )

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
                    userNameR: myMessages[0].userName,
                    userNameS: myMessages[1].userName,
                    photoR: myMessages[0].photo,
                    photoS: myMessages[1].photo
                });
                const messageId = arrayMessagesToUpdate[0].id;
                const messageRef = doc(db, 'Messages', messageId);
                await updateDoc(messageRef, { message: updatedMessages });
            } else {
                const newPost = {
                    message: [
                        {
                            content: newMessage,
                            createdAt: new Date(),
                            receptor: idreceiper,
                            sender: ideSender,
                            userNameR: myMessages[0].userName,
                            userNameS: myMessages[1].userName,
                            photoR: myMessages[0].photo,
                            photoS: myMessages[1].photo
                        }
                    ]
                };
                const postRef = collection(db, 'Messages');
                await addDoc(postRef, newPost);
            }
            setNewMessage('');
            toast('Message send', { type: 'success' });
        } catch (error) {
            console.log(error);
            toast('Error request', { type: 'error' });
        }
    };


    if (myMessages.length === 0) {
        return null;
    }

    //console.log(myMessages)

    return (
        <div className='single-card-msg'>
            <button className='single-card-msg-close' onClick={() => functionOpenClose('x')}><i className='bx bxs-x-circle'></i></button>
            <div className="card-msg-one-one">
                {arrayMessagesToUpdate.length === 0 &&
                    <div className="new-chat">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                placeholder='Escribe tu mensaje...'
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button onClick={functionReload} type='submit'>Enviar</button>
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
                            />
                            <button onClick={functionReload} type='submit'>Enviar</button>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}

export default Singlemessage;
