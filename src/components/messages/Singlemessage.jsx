import React, { useEffect, useRef, useState } from 'react';
import './Singlemessage.css';
import { addDoc, collection, updateDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db, storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import Displaychat from './Chat/Displaychat';
import Compressor from 'compressorjs';
import useSetMsgTimer from '../../hooks/useSetMsgTimer';
import { useAuthState } from 'react-firebase-hooks/auth';
import EmojiPicker from 'emoji-picker-react';
const Singlemessage = ({ idreceiper, ideSender }) => {

    const [userOnline] = useAuthState(auth)
    const [messages, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [enableShipping, setenable_Shipping] = useState(false)
    const [Allusers, setAllusers] = useState([])
    const [reloadMsg, setReloadMsg] = useState(false)
    const [imgUPto, setImgUPto] = useState('');
    const [textareaHeight, setTextareaHeight] = useState('30px');
    const [userChangePosition, setUserChangePosition] = useState(null)
    const { timer, myTimes } = useSetMsgTimer(userOnline)
    const [VisibleEmo, setVisibleEmo] = useState(false)
    const [filesImage, setfilesImage] = useState([])
    const [CommentFile, setCommentFile] = useState()
    const inputRef = useRef(null);
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
            const minHeight = 20;
            const maxHeight = 65;
            const step = 20;

            let height = minHeight + Math.floor((length + lenthLine) / 30) * step;
            height = Math.min(height, maxHeight);
            setTextareaHeight(height + 'px');
        };
        const containsLetterOrEmoji = () => {
            const text = newMessage
            // Expresión regular para letras y emojis
            const regex = /([a-zA-Z]|[\u231A-\uD83E\uDDFF])/g;
            // Retornar true si se encuentra al menos una coincidencia
            const Test = regex.test(text) || filesImage?.[0];
            setenable_Shipping(Test)
        }
        adjustTextareaHeight();
        containsLetterOrEmoji()
    }, [newMessage, filesImage]);

    const arrayMessagesToUpdate = messages.filter(data => {
        return (data.message[0].receptor === idreceiper && data.message[0].sender === ideSender) || (data.message[0].receptor === ideSender && data.message[0].sender === idreceiper);
    });

    const myMessages = Allusers.filter((match) => {
        if (match.idUser === idreceiper || match.idUser === ideSender) {
            return match
        }
    });

    const ValidatePhoto = (file) => {
        // Extensiones permitidas
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'avif'];
        const extension = file.name.split('.').pop()
        return allowedExtensions.includes(extension)
    }
    const handlePhotoChange = (file) => {
        Array.from(file).map((data) => {
            let Validatephoto = ValidatePhoto(data)
            if (Validatephoto) {
                new Compressor(data, {
                    quality: 0.6,
                    success(result) {
                        const UrlImg = URL.createObjectURL(result)
                        let InformImg = ({ Url: UrlImg, File: result, Coment: '' })
                        setfilesImage((prev) => [...prev, InformImg])
                    },
                    error(err) {
                        console.log(err)
                    }
                })
            }
        })
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
    const handleSubmit = async () => {
        if (!enableShipping) return;
        try {
            const Newpost = {
                createdAt: new Date(),
                receptor: idreceiper,
                sender: ideSender,
                userNameR: userChangePosition[0].userName,
                userNameS: userChangePosition[1].userName,
                photoR: userChangePosition[0].photo,
                photoS: userChangePosition[1].photo
            };

            let updatedMessages = arrayMessagesToUpdate.length > 0 ? [...arrayMessagesToUpdate[0].message] : [];
            const hasImages = filesImage?.length > 0;

            if (hasImages) {
                const imageUrls = await uploadImages(filesImage);
                const newMessages = filesImage.map((data, index) => ({
                    ...Newpost,
                    content: data.Coment.trim(),
                    imgUp: [
                        imageUrls[index],
                        {
                            emojisDB: ["🌱", "🌿", "🌳", "🌍", "🌻", "🌎", "🌲", "🍃", "🌞", "🌊", "🌸", "🍀", "🌾", "🌵", "🌼", "🐝", "🦋", "🐞", "🐢", "🌴", "😊", "👍", "👎", "🎉", "🙏", "🤣", "❤️", "😍", "😎", "😜", "😇", "😂", "😘", "😁", "🤩", "😋", "😴", "🤗", "🤔", "😕"],
                            emojisREACT: []
                        }
                    ]
                }));

                updatedMessages.push(...newMessages);
            } else {
                updatedMessages.push({ ...Newpost, content: newMessage.trim() });
            }

            if (arrayMessagesToUpdate.length > 0) {
                const messageId = arrayMessagesToUpdate[0].id;
                const messageRef = doc(db, 'Messages', messageId);
                await updateDoc(messageRef, { message: updatedMessages });
            } else {
                const postRef = collection(db, 'Messages');
                await addDoc(postRef, { message: updatedMessages });
            }

            myTimes(ideSender, idreceiper, userChangePosition[0].userName, userChangePosition[1].userName);
            setNewMessage('');
            setImgUPto('');
            setfilesImage([]);
            toast('Message send', { type: 'success' });
            functionReload();
        } catch (error) {
            console.error(error);
            toast('Error request', { type: 'error' });
        }
    };

    const uploadImages = async (images) => {
        return await Promise.all(images.map(async (data) => {
            const photoRef = `/images/${Date.now()}${data.File.name}`;
            const storageRef = ref(storage, photoRef);
            await uploadBytes(storageRef, data.File);
            return await getDownloadURL(storageRef);
        }));
    };

    if (myMessages.length === 0) {
        return null;
    }

    const removeItem = (itemToRemove, indexToRemove) => {
        const updatedItems = filesImage.filter((item, index) => item !== itemToRemove && index !== indexToRemove);
        setfilesImage(updatedItems);
        let data
        let length = updatedItems.length - 1
        let lengthIndex
        let index = indexToRemove - 1
        if (updatedItems.length > 0) {
            if (index === length) {
                lengthIndex = index
                data = updatedItems[lengthIndex]
            } else {
                lengthIndex = index + 1
                data = updatedItems[lengthIndex]
            }
            setCommentFile({ ...data, Index: lengthIndex })
        } else { setCommentFile(null) }
    };

    const updateItem = (index, newItem) => {
        setfilesImage(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = newItem;
            return updatedItems;
        })
    }

    const toggleKeyboard = () => {
        if (VisibleEmo) {
            inputRef.current.focus();
        } else {
            inputRef.current.blur();
        }
        setVisibleEmo(!VisibleEmo)
    };

    return (
        <div className='single-card-msg'>
            <div className="card-msg-one-one">
                {arrayMessagesToUpdate.length > 0 &&
                    <Displaychat newMessage={newMessage} reloadMsg={reloadMsg} idreceiper={idreceiper} ideSender={ideSender} />
                }
                <form>
                    {filesImage?.[0] && <div className='FileImg'>
                        {filesImage.map((data, index) => (
                            <div key={index}>
                                <img src={data.Url} onClick={() => (setCommentFile({ ...data, Index: index }), inputRef.current.focus())} className={CommentFile ?
                                    CommentFile.Index === index ? 'show' : ''
                                    : 0 === index ? 'show' : ''} />
                                <i className='bx bx-x' onClick={() => removeItem(data, index)}
                                />
                            </div>
                        ))}
                        <label className="file-input-label">
                            <input
                                type="file"
                                name={`image`}
                                accept="image/*"
                                multiple
                                onChange={(e) => handlePhotoChange(e.target.files)}
                                style={{ display: 'none' }}
                            />
                            <i class='bx bxs-image-add'></i>
                        </label>
                    </div>}
                    <div className="card-msg-one-one-form">
                        {VisibleEmo && <div className='Emoji'>
                            <EmojiPicker
                                height={370}
                                previewConfig={{ showPreview: false }}
                                searchDisabled={true}
                                onEmojiClick={(e) => {
                                    filesImage?.[0] ?
                                        CommentFile ? (updateItem(CommentFile.Index, { ...CommentFile, Coment: CommentFile.Coment + e.emoji }), setCommentFile(prev => ({ ...prev, Coment: prev.Coment + e.emoji }))) : updateItem(0, { ...filesImage[0], Coment: filesImage[0].Coment + e.emoji })
                                        : setNewMessage(prev => prev + e.emoji)
                                }}
                                style={{ position: 'absolute' }}
                            />
                            <div className='closeEmoji' onClick={() => setVisibleEmo(false)} />
                        </div>}
                        <section className='Text-message'>
                            <i className={VisibleEmo ? 'bx bxs-keyboard here' : 'bx bx-happy-alt here'} onClick={() => toggleKeyboard()}></i>
                            <textarea
                                ref={inputRef}
                                placeholder='Escribe tu mensaje...'
                                value={filesImage?.[0] ?
                                    CommentFile ? CommentFile.Coment : filesImage[0].Coment
                                    : newMessage}
                                onChange={(e) => filesImage?.[0] ?
                                    CommentFile ? (updateItem(CommentFile.Index, { ...CommentFile, Coment: e.target.value }), setCommentFile(prev => ({ ...prev, Coment: e.target.value }))) : updateItem(0, { ...filesImage[0], Coment: e.target.value })
                                    : setNewMessage(e.target.value)}
                                style={{ height: textareaHeight }}
                                rows={1}
                            />
                            <i className={enableShipping ? 'bx bxs-paper-plane' : 'bx bxs-paper-plane disable'} onClick={() => handleSubmit()} />
                        </section>
                        {filesImage?.[0] ?
                            '' :
                            <label className="file-input-label">
                                <input
                                    type="file"
                                    name={`image`}
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handlePhotoChange(e.target.files)}
                                    style={{ display: 'none' }}
                                />
                                <i className='bx bxs-image-alt'></i>
                            </label>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Singlemessage;
