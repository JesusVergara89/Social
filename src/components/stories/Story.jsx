import React, { useEffect, useState } from 'react'
import './Story.css'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { auth, db } from '../../firebaseConfig'
import useConnections from '../../hooks/useConnections'
import { useAuthState } from 'react-firebase-hooks/auth'
import Individualstory from './Individualstory'

const Story = () => {

    const [user] = useAuthState(auth)

    const [stories, setStories] = useState([])

    const { findFriends } = useConnections()

    useEffect(() => {
        const productREF = collection(db, 'stories')
        const q = query(productREF, orderBy('createdAt', 'desc'))
        onSnapshot(q, (snapshot) => {
            const stories = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setStories(stories)
        })
    }, [])

    const groupedStories = stories.reduce((acc, story) => {
        if (user && user.uid) {
            const showStory = findFriends.some(friend => friend.idUser === story.idCreator) || story.idCreator === user.uid;

            if (showStory) {
                if (!acc[story.idCreator]) {
                    acc[story.idCreator] = [];
                }
                acc[story.idCreator].push(story);
            }
        }
        return acc;
    }, {});

    const storiesToShow = Object.values(groupedStories);

    return (
        <div className='Stories'>
            {storiesToShow && storiesToShow.length > 0 && storiesToShow.map((group, groupIndex) => (
                <Individualstory key={groupIndex} group={group} story={group[0]} />
            ))}
        </div>
    )
}

export default Story