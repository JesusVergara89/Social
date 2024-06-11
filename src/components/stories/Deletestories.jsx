import { deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { db, storage } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import { deleteObject, ref } from 'firebase/storage';

const Deletestories = ({ stor, handleSetActivate }) => {

    const hours24InMillis = 24 * 60 * 60 * 1000;

    const deleteDocAsync = async () => {
        try {
            const docRef = doc(db, 'stories', stor.id);
            await deleteDoc(docRef);
            toast('Story borrada con éxito', { type: 'success' });
            const storageRef = ref(storage, stor.image);
            await deleteObject(storageRef);
            handleSetActivate(false)
        } catch (error) {
            console.log(error);
            toast('Error al borrar story', { type: 'error' });
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
