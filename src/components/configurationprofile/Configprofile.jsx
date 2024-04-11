import React, { useEffect, useState } from 'react'
import './Configprofile.css'
import { auth, db, storage } from '../../firebaseConfig'
import { useNavigate, useParams } from 'react-router-dom'
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { ref, uploadBytes } from 'firebase/storage'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, updateDoc } from 'firebase/firestore'

const Configprofile = () => {

    const { toConfig } = useParams()

    const [onlineUser] = useAuthState(auth)
    const [newDisplayName, setNewDisplayName] = useState('')
    const [newBio, setNewBio] = useState('')
    const [newPhoto, setNewPhoto] = useState(null)
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState('')
    ///const [allpost, setAllpost] = useState() Sin uso por por pruebas. 
    const [textareaHeight, setTextareaHeight] = useState('70px');
    const navigate = useNavigate()

    {/*useEffect(() => {
        const usersCollectionRef = collection(db, 'Post');
        const q = query(usersCollectionRef, orderBy("createdAt", "desc"))
        onSnapshot(q, (snapshot) => {
            const allpost = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setAllpost(allpost)
        })
    }, []);*/}

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
                try {
                    const photoRef = ref(storage, photoURL);           
                    await uploadBytes(photoRef, newPhoto);      
                    console.log('Foto actualizada exitosamente.');
                } catch (error) {
                    console.error('Error al actualizar la foto:', error);
                }
            }
            if (newDisplayName !== '' && newBio !== '') {
                await updateProfile(auth.currentUser, { displayName: newDisplayName });
                await updateDoc(doc(db, "Users", toConfig), {
                    name: newDisplayName,
                    bio: newBio
                });
            } else if (newDisplayName !== '' && newBio == '') {
                await updateProfile(auth.currentUser, { displayName: newDisplayName });
                await updateDoc(doc(db, "Users", toConfig), {
                    name: newDisplayName
                });
            } else if (newDisplayName == '' && newBio !== '') {
                await updateProfile(auth.currentUser, { displayName: newDisplayName });
                await updateDoc(doc(db, "Users", toConfig), {
                    bio: newBio
                });
            }{/* else {
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
            }*/}
            setNewBio('')
            setNewDisplayName('');
            setNewPhoto(null);
            setError(null);
            navigate('/profile')
        } catch (error) {
            setError(error.message);
        }
    }

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
