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
    const [newBio, setNewBio] = useState('')
    const [newPhoto, setNewPhoto] = useState(null)
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState('')
    const [allpost, setAllpost] = useState()
    const [textareaHeight, setTextareaHeight] = useState('70px');
    const [isChecked, setIsChecked] = useState(false);

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

    useEffect(() => {
        const adjustTextareaHeight = () => {
            const length = newBio.length;
            const minHeight = 30;
            const maxHeight = 500;
            const step = 30;

            let height = minHeight + Math.floor(length / 30) * step;
            height = Math.min(height, maxHeight);
            setTextareaHeight(height + 'px');
        };
        adjustTextareaHeight();
    }, [newBio]);

    const handleChangeDisplayName = (e) => {
        setNewDisplayName(e.target.value)
    }

    const handleChangeBio = (e) => {
        setNewBio(e.target.value)
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
            setEmail('')
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
                const photoRef = ref(storage, `/images/${Date.now()}/${newPhoto.name}`);
                await uploadBytes(photoRef, newPhoto);
                photoURL = await getDownloadURL(photoRef);
            }
            if (newDisplayName !== '' && newBio !== '') {
                await updateProfile(auth.currentUser, { displayName: newDisplayName, photoURL });
                await updateDoc(doc(db, "Users", toConfig), {
                    name: newDisplayName,
                    photo: photoURL,
                    bio: newBio
                });
            } else if (newDisplayName !== '' && newBio == '') {
                await updateProfile(auth.currentUser, { displayName: newDisplayName, photoURL });
                await updateDoc(doc(db, "Users", toConfig), {
                    name: newDisplayName,
                    photo: photoURL
                });
            } else if (newDisplayName == '' && newBio !== '') {
                await updateProfile(auth.currentUser, { displayName: newDisplayName, photoURL });
                await updateDoc(doc(db, "Users", toConfig), {
                    bio: newBio,
                    photo: photoURL
                });
            } else {
                await updateProfile(auth.currentUser, { photoURL });
                await updateDoc(doc(db, "Users", toConfig), {
                    photo: photoURL
                });
            }
            let postForChangeUserPhoto = allpost.filter((data, i) => {
                if (data.idOnlineUser === onlineUser.uid) {
                    return data
                }
            })
            if (isChecked === false) {
                for (let i = 0; i < postForChangeUserPhoto.length; i++) {
                    await updateDoc(doc(db, "Post", postForChangeUserPhoto[i].id), {
                        userPhoto: photoURL
                    })
                }
            }
            setNewBio('')
            setNewDisplayName('');
            setNewPhoto(null);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    }

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    console.log(isChecked)

    return (
        <div className='Configprofilemain'>
            <h2>Actualizar perfil</h2>
            {onlineUser && (
                <div className='Configprofilemain-form'>
                    <div className="Configprofilemain-form-currentdatauser">
                        <h3><span>Nombre actual:</span> <br /> {onlineUser.displayName}</h3>
                        <img src={onlineUser.photoURL} alt="Profile" />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <h6>Nuevo Nombre de Usuario:</h6>
                        <input placeholder='Nombre + Apellido' type="text" value={newDisplayName} onChange={handleChangeDisplayName} />

                        <h6>Nueva Biografía:</h6>
                        <textarea
                            type="text"
                            value={newBio}
                            onChange={handleChangeBio}
                            style={{ height: textareaHeight }}
                        />

                        <h6>Nueva Foto de Perfil:</h6>
                        <input type="file" accept="image/*" onChange={handleImageChange} />

                        <button type="submit">Actualizar</button>
                    </form>
                    <div className="proposal-config-profile">
                        <p>¡Únete a nosotros en el <span>#WrappProfileYear</span> y descubre una emocionante recopilación de todas las fotos que has establecido como perfil! Marca la casilla para unirte...</p>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <h6>Al marcar la casilla, autorizas a Social a no cambiar las fotos de perfil en las publicaciones ya realizadas. La nueva foto de perfil solo aparecerá en las publicaciones que realices después de establecerla.</h6>
                    </div>
                    <div className="Configprofilemain-form2">
                        <h4>Restablecer Contraseña</h4>
                        <p>Ingrese su correo electrónico para restablecer la contraseña</p>
                        <input type="email" value={email} onChange={handleChangeEmail} placeholder="Correo electrónico" />
                        <button onClick={handleResetPassword}>Enviar</button>
                        {message && <i>{message}</i>}
                        {error && <p>{error}</p>}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Configprofile
