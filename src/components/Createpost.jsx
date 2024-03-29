import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db, storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import '../style/Createpost.css';
import social from '../images/Social.svg'

const Createpost = () => {
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [currentlyLoggedinUser] = useAuthState(auth);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
    };

    const clearForm = () => {
        setDescription('');
        setPhoto(null);
    };

    const createTimestamp = () => {
        return Timestamp.now().toDate();
    };

    const createEmptyComments = () => {
        return {
            createdAt: null,
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
            let imageURL = '';
            if (photo) {
                const photoRef = `images/${currentlyLoggedinUser.uid}/${photo.name}`;
                const storageRef = ref(storage, photoRef);
                await uploadBytes(storageRef, photo);
                imageURL = await getDownloadURL(storageRef);
            }

            const postRef = collection(db, 'Post');
            const newPost = {
                description: description,
                image: imageURL,
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

    return (
        <article className="create-post">
            <div className="create-post-card">
                <img src={social} alt="" />
                <div className="brand-announcement">
                    <h2>Crea una publicación</h2>
                    <h2>¡Compártela!</h2>
                    <h2>Observa cómo se vuelve viral...</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />
                    <textarea
                        placeholder="Description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    <button type="submit">Publish</button>
                </form>
            </div>
        </article>
    );
}

export default Createpost;
