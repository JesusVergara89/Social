import React from 'react'
import '../style/Access.css'
import { useNavigate } from 'react-router-dom'

const Access = () => {
    const navigateToLogin = useNavigate()
    const navigateToRegister = useNavigate()
  return (
    <div className="access">
        <div className="access-options">
            <h3 onClick={()=> navigateToLogin('/login') }><span>Iniciar sesión</span></h3>
            <h3>o</h3>
            <h3 onClick={()=> navigateToRegister('/register') }><span>Regístrate</span></h3>
        </div>
    </div>
  )
}

export default Access