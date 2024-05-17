import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { CurrentUsercontext } from './CurrentUsercontext'

const StatelCurrentUser = ({ children }) => {
    const [userInfo] = useAuthState(auth)
    const [CurrentUser, setCurrentUser] = useState()
    useEffect(() => {
        if (userInfo) {
            const usersCollectionRef = collection(db, 'Users');
            const q = query(usersCollectionRef, where('idUser', '==', userInfo.uid))
            getDocs(q)
                .then((resp) => {
                    setCurrentUser(
                        () => {
                            const doc = resp.docs[0]
                            return {
                                ...doc.data(), id: doc.id
                            }
                        }
                    );
                })

        }
    }, [userInfo]);
    const data = { CurrentUser }
    return (
        <CurrentUsercontext.Provider value={data}>{children}</CurrentUsercontext.Provider>
    )
}

export default StatelCurrentUser