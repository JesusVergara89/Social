import React, { useEffect, useState } from 'react';
import './Register.css';
import social from '../images/Social.svg';
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Access from '../components/Access';

const Register = () => {
    const [currentlyLoggedinUser] = useAuthState(auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState(null);
    const [age, setAge] = useState('');
    const [bio, setBio] = useState('');
    const [userName, setUserName] = useState('')

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }    

    const navigate = useNavigate()

    useEffect(() => {
        scrollToTop();
        if (currentlyLoggedinUser) {
            const addUserToDatabase = async () => {
                try {
                    const articleRef = collection(db, 'Users');
                    await addDoc(articleRef, {
                        age: age,
                        bio: bio,
                        idUser: currentlyLoggedinUser.uid,
                        userName: userName
                    });
                    toast('Bio added successfully', { type: 'success' });
                    await signOut(auth);
                    navigate('/login')
                } catch (error) {
                    toast('Error adding bio', { type: 'error' });
                }
            };
            addUserToDatabase();
        }
    }, [currentlyLoggedinUser]);

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
                    const photoRef = `images/${user.uid}/${photo.name}`;
                    const storageRef = ref(storage, photoRef);
                    await uploadBytes(storageRef, photo);
                    const downloadURL = await getDownloadURL(storageRef);
                    await updateProfile(user, { photoURL: downloadURL });
                }
                toast('User registered successfully', { type: 'success' });
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
                    <input
                        type="text"
                        className='register-container2-password'
                        placeholder='Biography'
                        value={bio}
                        onChange={(e) => { setBio(e.target.value); }}
                    />
                    <input
                        type="text"
                        className='register-container2-password'
                        placeholder='User: @user'
                        value={userName}
                        onChange={(e) => { setUserName(e.target.value); }}
                    />
                    <div className='warning-photo'>Upload your profile photo here</div>
                    <input
                        className='register-container2-img'
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />
                    <button onClick={handleSingUp} className="register-container2-btn">Register</button>
                </div>
            </div>

            <div className="register-container3">
                <Access/>
            </div>
        </article>
    );
}

export default Register;
