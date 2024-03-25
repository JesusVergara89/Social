import React, { useEffect, useState } from 'react'
import './Login.css'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const navigate = useNavigate()

    useEffect(() => { scrollToTop() }, [])

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/verification')
        } catch (error) {
            toast(error.code, { type: "error" })
        }
    }

    const showPassword = () => setShow(!show)

    return (
        <article className="form-register-main">
            <div className="form-register-form">
                <h2 className="form-register-register">Login</h2>
                <input
                    type="text"
                    className='form-register-email'
                    placeholder='Enter your email'
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                <input
                    type={show ? "text" : "password"}
                    className='form-register-password'
                    placeholder='Password'
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <div onClick={showPassword} className="login-hiden">
                    {show ? <i className='bx bx-hide'></i> : <i className='bx bx-show'></i>}
                </div>
                <button onClick={handleLogin} className="form-register-btn">Login</button>
            </div>
        </article>
    )
}

export default Login