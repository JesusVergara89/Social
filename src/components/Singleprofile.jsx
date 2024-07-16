import React, { useEffect, useState } from 'react'
import '../style/Singleprofile.css'
import { useParams } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import Postofusers from './Postofusers'
import useConnections from '../hooks/useConnections'

const Singleprofile = () => {

  const { userProfile } = useParams()

  const { counterPost, counterConnectios, allpost, allrequest } = useConnections()

  const [user, setUser] = useState([])
  const [mostText, setmostText] = useState(false)

  useEffect(() => {
    const postRef = doc(db, 'Users', userProfile)
    onSnapshot(postRef, (snapshot) => {
      setUser({ ...snapshot.data(), id: snapshot.id })
    })
    setmostText(false)
  }, [userProfile])
  const TruncaText = (text, maxlength) => {
    if (text?.length > maxlength) {
      return !mostText ?
        <p>
          {text.substring(0, maxlength) + "..."}
          <button onClick={() => setmostText(prev => !prev)}>Ver mas</button>
        </p> :
        <p>
          {text}
        </p>
    } else {
      return text;
    }
  }
  return (
    <div className="Singleprofile">
      <div className='Single-ifnformation-main'>
        <div className='Singleprofile-information'>
          <img src={user.photo} alt="" className="Singleprofile-image" />
          <div className="Singleprofile-information-data">
            <h2 className="Singleprofile-userid">{`@${user.userName}`}</h2>
            <h3 className="Singleprofile-name">{user.name}</h3>
          </div>
        </div>
        <div className="Singleprofile-bio">{TruncaText(user.bio, 230)}</div>
      </div>
      <div className="single-profile-counters">
        <div className='Friendcounter'>
          <div className="Friendcounter-number">
            <h4><span>{counterConnectios(allrequest, user.idUser)}</span></h4>
          </div>
          <div className="Friendcounter-connections">
            <h4>{counterConnectios(allrequest, user.idUser) > 1 ? `Conexiones` : `Conexión`}</h4>
          </div>
        </div>
        <div className='Friendcounter'>
          <div className="Friendcounter-number">
            <h4><span>{counterPost(allpost, user.idUser)}</span></h4>
          </div>
          <div className="Friendcounter-connections">
            <h4>{counterPost(allpost, user.idUser) > 1 ? `Publicaciones` : `Publicación`}</h4>
          </div>
        </div>
      </div>

      <div className="Singleprofile-posts">
        <Postofusers id={user.idUser} />
      </div>
    </div>

  )
}

export default Singleprofile