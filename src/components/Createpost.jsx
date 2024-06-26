import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { addDoc, collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { auth, db, storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import '../style/Createpost.css';
import social from '../images/Social.png'

const Createpost = () => {

    /* Create a story    */
    const [formData, setFormData] = useState({
        idOnlineUser: '',
        createdAt: Timestamp.now().toDate(),
        image: ''
    });
    const [post_or_story, setPost_or_story] = useState(false)
    const [progress, setProgress] = useState(0);
    /* Create a story    */


    const [description, setDescription] = useState('');
    const [photos, setPhotos] = useState([null, null, null, null]);
    const [currentlyLoggedinUser] = useAuthState(auth);
    const [allUsers, setAllUsers] = useState();
    const [textareaHeight, setTextareaHeight] = useState('20px');

    useEffect(() => {
        const messagesRef = collection(db, 'Users')
        const q = query(messagesRef, orderBy('userName'))
        onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAllUsers(msgs)
        })
    }, []);

    useEffect(() => {
        const adjustTextareaHeight = () => {
            const length = description.length;
            const minHeight = 20;
            const maxHeight = 450;
            const step = 30;

            let height = minHeight + Math.floor(length / 30) * step;
            height = Math.min(height, maxHeight);
            setTextareaHeight(height + 'px');
        };
        adjustTextareaHeight();
    }, [description]);

    const getDataForPost = allUsers?.filter((data) => {
        if (data.idUser === currentlyLoggedinUser.uid) {
            return data
        }
    });

    const handlePhotoChange = (e, index) => {
        const file = e.target.files[0];
        const newPhotos = [...photos];
        newPhotos[index] = file;
        setPhotos(newPhotos);
    };

    const clearForm = () => {
        setDescription('');
        setPhotos([null, null, null, null]);
    };

    const createTimestamp = () => {
        return Timestamp.now().toDate();
    };

    const createEmptyComments = () => {
        return {
            createdAt: null,
            userPhoto: '',
            userName: '',
            main: '',
            idUser: '',
            others: {
                one: { content: '', createdAt: null, userID: '' },
                two: { content: '', createdAt: null, userID: '' },
                three: { content: '', createdAt: null, userID: '' },
                four: { content: '', createdAt: null, userID: '' },
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const imageUrls = await Promise.all(
                photos.map(async (photo) => {
                    if (photo) {
                        const photoRef = `/images/${Date.now()}${photo.name}`;
                        const storageRef = ref(storage, photoRef);
                        await uploadBytes(storageRef, photo);
                        return getDownloadURL(storageRef);
                    }
                    return null;
                })
            );

            const postRef = collection(db, 'Post');
            const newPost = {
                idOnlineUser: currentlyLoggedinUser.uid,
                description: description,
                userPhoto: getDataForPost[0].photo,
                userName: getDataForPost[0].userName,
                images: imageUrls,
                likes: [],
                createdAt: createTimestamp(),
                comments: [createEmptyComments()]
            };
            await addDoc(postRef, newPost);

            toast('Post added successfully', { type: 'success' });
            clearForm();
        } catch (error) {
            console.error('Error adding post: ', error);
            toast('Error adding post', { type: 'error' });
        }
    };


    /* Create a story    */

    const handleChangeImage = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handlePublish = () => {
        if (!formData.image) {
            alert('Por favor completar los campos requeridos');
            return;
        }
        const storageRef = ref(storage, `/images/${Date.now()}${formData.image.name}`);
        const uploadImage = uploadBytesResumable(storageRef, formData.image);

        uploadImage.on("state_changed",
            (snapshot) => {
                const progressPercent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progressPercent);
            },
            (err) => {
                console.log(err);
                toast("Error al subir la imagen", { type: "error" });
            },
            () => {
                setFormData({
                    idOnlineUser: '',
                    createdAt: '',
                    image: ''
                });

                getDownloadURL(uploadImage.snapshot.ref)
                    .then((url) => {
                        const productref = collection(db, 'stories');
                        addDoc(productref, {
                            idOnlineUser: currentlyLoggedinUser.uid,
                            createdAt: Timestamp.now().toDate(),
                            image: url,
                            userName: currentlyLoggedinUser.displayName
                        })
                            .then(() => {
                                toast("Story agregada correctamente", { type: "success" });
                                setProgress(0);
                                setFormData({
                                    idOnlineUser: '',
                                    createdAt: '',
                                    image: ''
                                });

                            })
                            .catch(e => {
                                console.error(e);
                                toast("Error agregando la story", { type: "error" });
                            });
                    });
            }
        );
    };


    const PostOrStory = () => {
        setPost_or_story(!post_or_story)
    }

    /* Create a story    */


    return (
        <div className='create-post-or-story'>
            <button className='create-post-or-story-btn' onClick={PostOrStory}>{`${post_or_story === false ? 'Create post' : 'Create Story'}`}</button>
            {post_or_story === false ?
                (
                    <article className='create-story'>
                        <input
                            type="file"
                            className='image'
                            accept='/*'
                            onChange={handleChangeImage}
                        />
                        {progress === 0 ? null : (
                            <div className="progress">
                                <div className="progress-bar progress-bar-striped" style={{ width: `${progress}%` }}>
                                    <h5>{`Subiendo imagen ${progress}%`}</h5>
                                </div>
                            </div>
                        )}
                        <button onClick={handlePublish} className="create">Create story</button>
                    </article>
                )
                :
                (
                    <article className="create-post">
                        <div className="create-post-card">
                            <img src={social} alt="" />
                            <div className="brand-announcement">
                                <h2>Crea una publicación</h2>
                                <h2>¡Compártela!</h2>
                                <h2>Observa cómo se vuelve viral...</h2>
                            </div>
                            <form onSubmit={handleSubmit}>
                                {photos.map((_, index) => (
                                    <input
                                        key={index}
                                        type="file"
                                        name={`image${index}`}
                                        accept="image/*"
                                        onChange={(e) => handlePhotoChange(e, index)}
                                    />
                                ))}
                                <textarea
                                    placeholder="Description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{ height: textareaHeight }}
                                    rows={1}
                                />
                                <button type="submit">Publish</button>
                            </form>
                        </div>
                    </article>
                )
            }
        </div>
    );


}

export default Createpost;
