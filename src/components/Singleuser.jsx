import React, { useEffect, useState } from 'react'
import '../style/Singleuser.css'
import Contactutility from './messages/Contactutility'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebaseConfig'
import { useParams } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'

const Singleuser = () => {

    const [getUser, setGetUser] = useState()
    const { iduser } = useParams()
    const [thiIsTheCurrentUser] = useAuthState(auth)

    useEffect(() => {
        const usersCollection = collection(db, "Users");
        getDocs(usersCollection)
            .then((querySnapshot) => {
                const usersData = [];
                querySnapshot.forEach((doc) => {
                    usersData.push({ ...doc.data(), id: doc.id });
                });
                setGetUser(usersData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const thisUser = getUser?.find(user => user.idUser === iduser);

    ///console.log(thisUser)

    return (
        <article className="single-user">
            {thisUser ?
                <div className="single-user-to-contact">
                    <div className='all-users-profile-information-to-contact'>
                        <div className="all-users-profile-information-image">
                            <img src={thisUser.photo} alt="" className="all-users-profile-image" />
                        </div>
                        <div className="all-users-profile-information-data">
                            <h2 className="all-users-userid">{`@${thisUser.userName}`}</h2>
                            <h3 className="all-users-name">{thisUser.name}</h3>
                            <p className="all-users-bio">{thisUser.bio}</p>
                        </div>
                    </div>
                    <Contactutility idCurrentUser={thiIsTheCurrentUser?.uid} idUSER={thisUser.idUser} />
                </div>
                :
                <h5>Usuario no encontrado</h5>
            }
        </article>
    )
}

export default Singleuser