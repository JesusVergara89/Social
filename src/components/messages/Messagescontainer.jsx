import React, { useEffect, useState } from 'react'
import { auth } from '../../firebaseConfig';
import './Messagescontainer.css'
import Singlemessage from './Singlemessage';
import { useAuthState } from 'react-firebase-hooks/auth';
import Cardmsg from './Chat/Cardmsg';

const Messagescontainer = ({ idreceiper }) => {

  const [openCloseSingleMessage, setOpenCloseSingleMessage] = useState(false)
  const [thisUser] = useAuthState(auth)

  const functionOpenClose = (parameter) => {
    if (parameter) {
      setOpenCloseSingleMessage(!openCloseSingleMessage)
    } else {
      if (idreceiper === 'xxhxc') {
        setOpenCloseSingleMessage(false)
      } else {
        setOpenCloseSingleMessage(true)
      }
    }
  }

  useEffect(() => {
    functionOpenClose()
  }, [idreceiper]);


  return (
    <article className="Messagescontainer">
      {openCloseSingleMessage ?
        ''
        :
        <div className="Messagescontainer-all">
          <Cardmsg />
        </div>
      }
      {openCloseSingleMessage ?
        <div className="Messagescontainer-single-chat">
          <Singlemessage functionOpenClose={functionOpenClose} idreceiper={idreceiper} ideSender={thisUser.uid} />
        </div>
        :
        ''
      }
    </article>
  )
}

export default Messagescontainer