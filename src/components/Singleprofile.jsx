import React, { useEffect, useState } from 'react'
import '../style/Singleprofile.css'
import { useParams } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import Postofusers from './Postofusers'

const Singleprofile = () => {

  const { userProfile, connections, post } = useParams()

  const [user, setUser] = useState([])

  useEffect(() => {
    const postRef = doc(db, 'Users', userProfile)
    onSnapshot(postRef, (snapshot) => {
      setUser({ ...snapshot.data(), id: snapshot.id })
    })
  }, [])

  return (
    <div className="Singleprofile">
      <div className="Singleprofile-container">
        <div className='Singleprofile-information'>
          <div className="Singleprofile-information-image">
            <img src={user.photo} alt="" className="Singleprofile-image" />
          </div>
          <div className="Singleprofile-information-data">
            <h2 className="Singleprofile-userid">{`@${user.userName}`}</h2>
            <h3 className="Singleprofile-name">{user.name}</h3>
            <p className="Singleprofile-bio">{user.bio}</p>
          </div>
        </div>
        <div className="single-profile-counters">
          <div className='Friendcounter'>
            <div className="Friendcounter-number">
              <h4><span>{connections}</span></h4>
            </div>
            <div className="Friendcounter-connections">
              <h4>{connections > 1 ? `Conexiones` : `Conexión`}</h4>
            </div>
          </div>
          <div className='Friendcounter'>
            <div className="Friendcounter-number">
              <h4><span>{post}</span></h4>
            </div>
            <div className="Friendcounter-connections">
              <h4>{post > 1 ? `Publicaciones` : `Publicación`}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="Singleprofile-posts">
         <Postofusers  id={user.idUser} />
      </div>
    </div>

  )
}

export default Singleprofile