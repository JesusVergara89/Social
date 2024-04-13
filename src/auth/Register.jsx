import React, { useEffect, useState } from 'react';
import './Register.css';
import social from '../images/Social.svg';
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import Access from '../components/Access';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const Register = ({ setNewuser }) => {
    const [currentlyLoggedinUser] = useAuthState(auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState(null);
    const [age, setAge] = useState('');
    const [bio, setBio] = useState('');
    const [userName, setUserName] = useState('')
    const [textareaHeight, setTextareaHeight] = useState('30px');
    const [modalusername, setModalusername] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const [usuarioExistente, setUsuarioExistente] = useState(false);

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        const usersCollectionRef = collection(db, 'Users');
        const q = query(usersCollectionRef, orderBy('userName'))
        onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAllUsers(users);
        })
    }, []);

    const navigate = useNavigate()

    useEffect(() => {
        scrollToTop();
        if (currentlyLoggedinUser) {
            const newUser = {
                age: age,
                bio: bio,
                idUser: '',
                userName: userName,
                photo: '',
                name: name
            };
            setNewuser(newUser);
        }
    }, [currentlyLoggedinUser]);

    useEffect(() => {
        const adjustTextareaHeight = () => {
            const length = bio.length;
            const minHeight = 30;
            const maxHeight = 300;
            const step = 30;

            let height = minHeight + Math.floor(length / 30) * step;
            height = Math.min(height, maxHeight);
            setTextareaHeight(height + 'px');
        };
        adjustTextareaHeight();
    }, [bio]);

    const handleSingUp = async () => {
        if (!name || !email || !photo) {
            toast('Please fill in name, email, and photo fields', { type: 'error' });
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (user) {
                await updateProfile(user, { displayName: name, photoURL: '' });
                if (photo) {
                    const photoRef = `/images/${Date.now()}${photo.name}}`;
                    const storageRef = ref(storage, photoRef);
                    await uploadBytes(storageRef, photo);
                    const downloadURL = await getDownloadURL(storageRef);
                    await updateProfile(user, { photoURL: downloadURL });
                }
                toast('User registered successfully', { type: 'success' });
                signOut(auth)
                navigate('/login');
                clearForm();
            }
        } catch (error) {
            toast(error.code, { type: 'error' });
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
    };

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setPhoto(null);
        setAge('');
        setBio('');
        setUserName('');
    };

    const functionmodalusername = () => {
        setModalusername(!modalusername)
        document.getElementById("username").removeEventListener("click", functionmodalusername);
    }
    const letElementforModalUserName = () => {
        setModalusername(!modalusername)
        document.getElementById("username").removeEventListener("click", functionmodalusername);
    }
    document.getElementById("username")?.addEventListener("click", functionmodalusername);

    const handleInputChange = (event) => {
        const valor = event.target.value;
        if (allUsers && allUsers.length > 0) {
            const usuarioExistente = allUsers.some(usuario =>
                usuario.userName === valor
            );
            setUsuarioExistente(usuarioExistente);
            if (usuarioExistente) {
                toast('Este usuario ya existe, tienes que elegir uno distinto!', { type: 'warning' });
            }
        }
    };
    console.log(usuarioExistente)
    return (
        <article className="register">
            <div className="register-container1">
                <img src={social} alt="" />
            </div>

            <div className="register-container2">
                <div className="register-container2-form">
                    <input
                        type="text"
                        className='register-container2-name'
                        placeholder='Name'
                        value={name}
                        onChange={(e) => { setName(e.target.value); }}
                    />
                    <input
                        type="text"
                        className='register-container2-email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); }}
                    />
                    <input
                        type="password"
                        className='register-container2-password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); }}
                    />
                    <input
                        type="text"
                        className='register-container2-password'
                        placeholder='Age'
                        value={age}
                        onChange={(e) => { setAge(e.target.value); }}
                    />
                    <textarea
                        type="text"
                        className='register-container2-textarea'
                        placeholder='Biography'
                        value={bio}
                        onChange={(e) => { setBio(e.target.value); }}
                        style={{ height: textareaHeight }}
                    />
                    <div className="around">
                        <input
                            id='username'
                            type="text"
                            className='register-container2-username'
                            placeholder='User: @user'
                            value={userName}
                            onChange={(e) => { setUserName(e.target.value); handleInputChange(e) }}
                        />
                        <div className={modalusername ? "modalusername" : "none"}>
                            <h6 onClick={letElementforModalUserName}><i className='bx bxs-x-circle'></i></h6>
                            <h6>Una vez establecido el @userName, no podras cambiarlo. &#128556;</h6>
                        </div>
                    </div>
                    <div className='warning-photo'>Upload your profile photo here</div>
                    <input
                        className='register-container2-img'
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />
                    {usuarioExistente ? '' : <button onClick={handleSingUp} className="register-container2-btn">Register</button>}
                </div>
            </div>

            <div className="register-container3">
                <Access />
            </div>
        </article>
    );
}

export default Register;
