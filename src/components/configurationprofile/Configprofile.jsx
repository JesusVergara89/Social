import React, { useEffect, useState } from 'react'
import './Configprofile.css'
import { auth, db, storage } from '../../firebaseConfig'
import { useParams } from 'react-router-dom'
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'

const Configprofile = () => {

    const { toConfig } = useParams()

    const [onlineUser] = useAuthState(auth)
    const [newDisplayName, setNewDisplayName] = useState('')
    const [newPhoto, setNewPhoto] = useState(null)
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState('')
    const [allpost, setAllpost] = useState()

    useEffect(() => {
        const usersCollectionRef = collection(db, 'Post');
        const q = query(usersCollectionRef, orderBy("createdAt", "desc"))
        onSnapshot(q, (snapshot) => {
            const allpost = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setAllpost(allpost)
        })
    }, []);

    const handleChangeDisplayName = (e) => {
        setNewDisplayName(e.target.value)
    }

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setNewPhoto(e.target.files[0])
        }
    }
    
    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage(`Se ha enviado un correo electrónico de restablecimiento de contraseña a ${email}`);
            setError(null);
        } catch (error) {
            setError(error.message);
            setMessage('');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()  
        try {
            let photoURL = onlineUser.photoURL;
            if (newPhoto) {
                const photoRef = ref(storage, `images/${onlineUser.uid}/${newPhoto.name}`);
                await uploadBytes(photoRef, newPhoto);
                photoURL = await getDownloadURL(photoRef);
            }
            if (newDisplayName !== '') {
                await updateProfile(auth.currentUser, { displayName: newDisplayName, photoURL });
                await updateDoc(doc(db, "Users", toConfig), {
                    name: newDisplayName,
                    photo: photoURL
                });
            } else {
                await updateProfile(auth.currentUser, { photoURL });
                await updateDoc(doc(db, "Users", toConfig), {
                    photo: photoURL
                });
            }
            let postForChangeUserPhoto = allpost.filter((data,i) =>{
                if(data.idOnlineUser === onlineUser.uid){
                    return data
                }
            })
            for (let i = 0; i < postForChangeUserPhoto.length; i++) {
                await updateDoc(doc(db, "Post", postForChangeUserPhoto[i].id), {
                    userPhoto: photoURL
                })
            }
            setNewDisplayName('');
            setNewPhoto(null);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    }

    ///console.log(allpost)

    return (
        <div className='Configprofilemain'>
            <h2>Configuración de Perfil</h2>
            {onlineUser && (
                <div>
                    <h3>Nombre de usuario actual: {onlineUser.displayName}</h3>
                    <img src={onlineUser.photoURL} alt="Profile" />
                    <form onSubmit={handleSubmit}>
                        <label>Nuevo Nombre de Usuario:</label>
                        <input type="text" value={newDisplayName} onChange={handleChangeDisplayName} />

                        <label>Nueva Foto de Perfil:</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />

                        <button type="submit">Actualizar Perfil</button>
                    </form>
                    <hr />
                    <h3>Restablecer Contraseña</h3>
                    <p>Ingrese su correo electrónico para recibir un enlace de restablecimiento de contraseña.</p>
                    <input type="email" value={email} onChange={handleChangeEmail} placeholder="Correo electrónico" />
                    <button onClick={handleResetPassword}>Enviar Correo Electrónico</button>
                    {message && <p>{message}</p>}
                    {error && <p>{error}</p>}
                </div>
            )}
        </div>
    )
}

export default Configprofile
