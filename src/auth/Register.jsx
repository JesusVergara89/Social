import React, { useEffect, useState } from 'react';
import '../style/form.css'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import Compressor from 'compressorjs';
import Loader from '../components/Loading/Loader';

const Register = () => {
    const [textareaHeight, setTextareaHeight] = useState('35px');
    const [allUsers, setAllUsers] = useState([])
    const { register, handleSubmit, resetField, formState: { errors }, watch } = useForm();
    const [Ok, setOk] = useState(true)
    const [show, setShow] = useState(false)
    const navigateToLogin = useNavigate()
    const [InformImg, setInformImg] = useState()
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

    let biografy = watch('Biography')
    const adjustTextareaHeight = () => {
        const length = biografy?.length;
        const lenthLine = (biografy?.split('\n').length - 1) * 30
        const minHeight = 30;
        const maxHeight = 200;
        const step = 20;
        
        let height = minHeight + Math.floor((length + lenthLine) / 30) * step;
        height = Math.min(height, maxHeight);
        setTextareaHeight(height + 'px');
    };
    useEffect(() => {
        adjustTextareaHeight();
    }, [biografy]);

    const submit = async ({ email, password, name, age, Biography = '', user }) => {
        try {
            setOk(false)
            await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, `/images/${Date.now()}${name}`);
            const snapshot = await uploadBytesResumable(storageRef, InformImg.File);
            //se obtiene la url de la imagen subida
            const url = await getDownloadURL(snapshot.ref);
            // se crea el usuario
            await updateProfile(auth.currentUser, { displayName: name, photoURL: url });
            const articleRef = collection(db, 'Users');
            await addDoc(articleRef, {
                age: age,
                bio: Biography,
                idUser: auth.currentUser.uid,
                userName: user,
                photo: auth.currentUser.photoURL,
                name: name
            });
            navigateToLogin('/');
            toast('Usuario registrado con éxito', { type: 'success' });
            reset();
            setInformImg(null);
            setOk(true)
        } catch (error) {
            toast(error.code, { type: 'error' }, setOk(true));
        }
    };

    const showPassword = () => setShow(!show)

    const ValidatePhoto = () => {
        // Extensiones permitidas
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'avif'];
        const extension = value?.[0].name.split('.').pop()
        return allowedExtensions.includes(extension)
    }

    const Sizeimg = (file) => {
        let Size
        let SizeKb = (file.size / 1024).toFixed(1)
        if (SizeKb >= 1024) {
            let SizeMb = (SizeKb / 1024).toFixed(1)
            Size = `${SizeMb} MB`
        } else {
            Size = `${SizeKb} KB`
        }
        return Size
    }

    let value = watch('photo')
    useEffect(() => {
        let e = value?.[0]
        if (e) {
            let Validatephoto = ValidatePhoto()
            if (Validatephoto) {
                new Compressor(e, {
                    quality: 0.6,
                    maxWidth: 500,
                    maxHeight: 500,
                    success(result) {
                        let SizeCompri = Sizeimg(result)
                        const UrlImg = URL.createObjectURL(result)
                        setInformImg({ sizeCompri: SizeCompri, Url: UrlImg, File: result })
                    },
                    error(err) {
                        console.log(err)
                    }
                })
            } else if (InformImg) {
                toast('Formato de archivo invalido, solo imágenes', { type: "error" });
            } else {
                setInformImg(null)
            }
        }
    }, [value])

    const Validateimg = (e) => {
        let Validatephoto = true
        if (e?.[0] && !InformImg) {
            // Extensiones permitidas
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'avif'];
            const extension = e[0].name.split('.').pop()
            Validatephoto = allowedExtensions.includes(extension)
        }
        return Validatephoto
    }

    const ValidateUser = (value) => {
        return !(allUsers.some(usuario =>
            usuario.userName === value))
    }
    const ValidateAge = (value) => {
        return value >= 15 && value <= 100
    }

    return (
        <form className='form_main' onSubmit={handleSubmit(submit)} >
            <h3>Register</h3>
            <section className={watch('name') ? 'form_user on' : 'form_user'}>
                <input autoComplete='off' className={errors.name?.type === 'required' ? 'input_user on' : 'input_user'} type="text" inputMode='text' {...register("name", { required: true })} />
                <label>Name:</label>
                <i className='bx bx-user'></i>
            </section>
            {errors.name?.type === 'required' &&
                <p className='error'>Por favor, ingrese el nombre.</p>
            }
            <section className={watch('email') ? 'form_user on' : 'form_user'}>
                <input autoComplete='off' className={errors.email?.type === 'required' || errors.email?.type === 'pattern' ? 'input_user on' : 'input_user'} type="text" inputMode='email' {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} />
                <label>Email:</label>
                <i className='bx bx-envelope' ></i>
            </section>
            {errors.email?.type === 'required' &&
                <p className='error'>Por favor, ingrese el email.</p>
            }
            {errors.email?.type === 'pattern' &&
                <p className='error'>Por favor, ingrese un correo electrónico válido.</p>
            }
            <section className={watch('password') ? 'form_password on' : 'form_password'}>
                <input autoComplete='off' className={errors.password?.type === 'required' ? 'input_password on' : 'input_password'} type={show ? "text" : "password"}{...register("password", { required: true })} />
                <label>Password:</label>
                <i className='bx bx-lock'></i>

                <div onClick={showPassword} className="login-hiden">
                    {show ? <i className='bx bx-hide'></i> : <i className='bx bx-show'></i>}
                </div>
            </section>
            {errors.password?.type === 'required' &&
                <p className='error'>Por favor, ingrese una contraseña.</p>
            }
            <section className={watch('age') ? 'form_user on' : 'form_user'}>
                <input autoComplete='off' className={errors.age?.type === 'required' || errors.age?.type === 'pattern' ? 'input_user on' : 'input_user'} type="text" inputMode='numeric' {...register("age", { required: true, pattern: /^\d+(\.\d+)?$/, validate: ValidateAge })} />
                <label>Age:</label>
                <i className='bx bx-calendar'></i>
            </section>
            {errors.age?.type === 'required' &&
                <p className='error'>Por favor, ingrese la edad.</p>
            }
            {errors.age?.type === 'pattern' &&
                <p className='error'>Por favor, digite solamente numero.</p>
            }
            {errors.age?.type === 'validate' &&
                <p className='error'>La edad ingresada no es válida. Intenta con una edad entre [15~100]</p>
            }
            <section className={watch('Biography') ? 'form_Biography on' : 'form_Biography'}>
                <textarea className='input_Biography' {...register("Biography")} style={{ height: textareaHeight }} />
                <label>Biography:</label>
            </section>
            <section className={watch('user') ? 'form_user on' : 'form_user'}>
                <input autoComplete='off' className={errors.user?.type === 'required' ? 'input_user on' : 'input_user'} type="text" inputMode='text' {...register("user", { required: true, validate: ValidateUser })} />
                <label>User:</label>
                <i className='bx bx-at'></i>
                <p>
                    Una vez establecido el @User, no podrás cambiarlo.
                </p>
            </section>
            {errors.user?.type === 'required' &&
                <p className='error'>Por favor, ingrese el nombre del usuario.</p>
            }
            {errors.user?.type === 'validate' &&
                <p className='error'>Este usuario ya existe, tienes que elegir uno distinto!</p>
            }
            <section className={errors.photo?.type === 'required' || errors.photo?.type === 'validate' ? 'form_file on' : 'form_file'}>
                <label>Subir foto de perfil</label>
                <div className={errors.photo?.type === 'required' || errors.photo?.type === 'validate' ? 'file_imagen on' : 'file_imagen'}>
                    <input autoComplete='off' type='file' accept='image/*' {...register('photo', {
                        required: true,
                        validate: () => {
                            return Validateimg(watch('photo'))
                        }

                    })} className='input_file' />
                    {InformImg ?
                        <img src={InformImg.Url} />
                        : <>
                            <i className='bx bx-image-add'></i>
                            <p>Seleccione el archivo a subir</p>
                        </>
                    }
                </div>
                {InformImg &&
                    <section className='information_imagen'>
                        <p>Archivo cargado</p>
                        <div className='data_imagen'>
                            <i className='bx bx-file-blank'></i>
                            <p>{InformImg.sizeCompri}</p>
                            <i onClick={() => {
                                resetField('photo')
                                setInformImg(null)
                            }} className='bx bx-x'></i>
                        </div>
                    </section>
                }
            </section>
            {errors.photo?.type === 'required' &&
                <p className='error'>Por favor, suba el archivo.</p>
            }
            {errors.photo?.type === 'validate' &&
                <p className='error'>Formato de archivo invalido, solo imágenes</p>
            }
            {Ok ? <button className='protect-route-btn' type='submit'>Register</button>
                : <Loader />
            }
            <p className='form_enlace'>
                ¿Ya tiene cuenta?
                <p onClick={() => navigateToLogin('/login')}>Iniciar sesión</p>
            </p>
        </form>
    );
}

export default Register;
