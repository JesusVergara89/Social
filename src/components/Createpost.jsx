import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db, storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import '../style/Createpost.css';

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
            others: {
                one: { content: '', createdAt: null },
                two: { content: '', createdAt: null },
                three: { content: '', createdAt: null },
                four: { content: '', createdAt: null },
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
                comments: [createEmptyComments()] // Inicializar con comentarios vacíos
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
