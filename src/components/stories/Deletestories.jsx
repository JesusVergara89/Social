import { deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { auth, db, storage } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import { deleteObject, ref } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';

const Deletestories = ({ stor }) => {

    const [user] = useAuthState(auth);
    const hours24InMillis = 24 * 60 * 60 * 1000;

    const deleteDocAsync = async () => {
        if (user && user.uid === stor.idOnlineUser) {
            try {
                const docRef = doc(db, 'stories', stor.id);
                await deleteDoc(docRef);
                toast('Story borrada con éxito', { type: 'success' });
                
                const storageRef = ref(storage, stor.image);
                await deleteObject(storageRef);
            } catch (error) {
                console.log(error);
                toast('Error al borrar story', { type: 'error' });
            }
        }
    };

    useEffect(() => {
        const now = Date.now();
        if (stor && stor.createdAt) {
            const createdAtMillis = new Date(stor.createdAt).getTime();
            if ((now - createdAtMillis) > hours24InMillis) {
                deleteDocAsync();
            }
        }
    }, [stor]);

    return (
        <div></div>
    );
};

export default Deletestories;
