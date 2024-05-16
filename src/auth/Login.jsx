import React, { useState } from 'react'
import './Login.css'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import social from '../images/Social.png'
import '../style/form.css'
import { useForm } from 'react-hook-form'
import Loader from '../components/Loading/Loader'

const Login = () => {
    
    const [show, setShow] = useState(false)

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [Ok, setOk] = useState(true)
    const navigateToLogin = useNavigate()

    const submit = ({ email, password }) => {
        setOk(false)
        signInWithEmailAndPassword(auth, email, password)
            .then(() => navigate('/profile'))
            .catch((error) => {
                toast(error.code, { type: "error" })
                setOk(true)
            })
    };

    const showPassword = () => setShow(!show)

    return (
        <form className='form_main' onSubmit={handleSubmit(submit)} >
            <img src={social} alt="" />
            <h3>Log in</h3>
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
                <label>Password</label>
                <i className='bx bx-lock'></i>
                <div onClick={showPassword} className="login-hiden">{show ? <i className='bx bx-hide'></i> : <i className='bx bx-show'></i>}
                </div>
            </section>
            {errors.password?.type === 'required' &&
                <p className='error'>Por favor, ingrese una contraseña.</p>
            }
            {Ok ? <button className='protect-route-btn' type='submit'>Login</button>
                : <Loader />
            }
            <p className='form_enlace'>
                ¿No tiene cuenta?
                <p onClick={() => navigateToLogin('/register')}>Regístrate</p>
            </p>
        </form>
    )
}

export default Login