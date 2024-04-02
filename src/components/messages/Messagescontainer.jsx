import { auth } from '../../firebaseConfig';
import './Messagescontainer.css'
import Singlemessage from './Singlemessage';
import { useAuthState } from 'react-firebase-hooks/auth';

const Messagescontainer = ({ idreceiper }) => {

  const [thisUser] = useAuthState(auth)

  return (
    <article className="Messagescontainer">
      
        <div className="Messagescontainer-single-chat">
          <Singlemessage idreceiper={idreceiper} ideSender={thisUser.uid} />
        </div>
        
    </article>
  )
}

export default Messagescontainer