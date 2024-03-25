import React from 'react'
import ReactDOM from 'react-dom/client'
import Social from './Social.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { HashRouter } from 'react-router-dom'
import 'font-awesome/css/font-awesome.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ToastContainer />
      <Social />
    </HashRouter>
  </React.StrictMode>,
)
