import React, { useEffect, useState } from 'react'
import './Login.css'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Access from '../components/Access'

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
            navigate('/profile')
        } catch (error) {
            toast(error.code, { type: "error" })
        }
    }

    const showPassword = () => setShow(!show)

    return (
        <article className="Login-container">
            <article className="Login">
                <h2 className="Login-heading">Login</h2>
                <input
                    type="text"
                    className='Login-email'
                    placeholder='Enter your email'
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                <input
                    type={show ? "text" : "password"}
                    className='Login-password'
                    placeholder='Password'
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <div onClick={showPassword} className="Login-toggle-password">
                    {show ? <i className='bx bx-hide'></i> : <i className='bx bx-show'></i>}
                </div>
                <button onClick={handleLogin} className="Login-button">Login</button>
            </article>
            <Access/>
        </article>
    )
}

export default Login