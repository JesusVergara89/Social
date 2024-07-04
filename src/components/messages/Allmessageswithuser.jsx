import React from 'react'
import Cardmsg from './Chat/Cardmsg'
import './Allmessageswithuser.css'

const Allmessageswithuser = () => {
  return (
    <div className="Allmessageswithuser">
      <Cardmsg />
      <div className='InboxMessage'>
        <i className='bx bxs-paper-plane' />
        <p>Envía fotos y mensajes privados a un amigo.</p>
      </div>
    </div>
  )
}

export default Allmessageswithuser