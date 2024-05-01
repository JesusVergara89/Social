import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'

const usePostofuser = (id) => {

    const [post, setPost] = useState([])

    useEffect(() => {
        const postsRef = collection(db, "Post")
        const q = query(postsRef, orderBy("userName"))
        onSnapshot(q, (snapshot) => {
            const reqPost = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPost(reqPost);
        });
    }, [])

    const postProfile = post.filter((data) => {
        if (data.idOnlineUser === id) {
            return data
        }
    })

    return { postProfile }
}

export default usePostofuser