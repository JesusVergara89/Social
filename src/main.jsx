import React from 'react'
import ReactDOM from 'react-dom/client'
import Social from './Social.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { HashRouter } from 'react-router-dom'
import 'font-awesome/css/font-awesome.css'
import { Provider } from 'react-redux'
import store from './store/index'
import StatelCurrentUser from './components/Context/StatelCurrentUser.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <StatelCurrentUser>
      <Provider store={store} >
        <ToastContainer />
        <Social />
      </Provider>
    </StatelCurrentUser>
  </HashRouter>
)
