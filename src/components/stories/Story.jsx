import React, { useEffect, useState } from 'react';
import './Story.css';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import useConnections from '../../hooks/useConnections';
import { useAuthState } from 'react-firebase-hooks/auth';
import Individualstory from './Individualstory';

const Story = () => {

    const [user] = useAuthState(auth);
    const [stories, setStories] = useState([]);
    const { findFriends } = useConnections();

    useEffect(() => {
        const productREF = collection(db, 'stories');
        const q = query(productREF, orderBy('createdAt', 'desc'));
        onSnapshot(q, (snapshot) => {
            const stories = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStories(stories);
        });
    }, []);

    const groupedStories = stories.reduce((acc, story) => {
        if (user && user.uid) {
            const showStory = findFriends.some((friend) => friend.idUser === story.idOnlineUser) || story.idOnlineUser === user.uid;

            if (showStory) {
                if (!acc[story.idOnlineUser]) {
                    acc[story.idOnlineUser] = [];
                }
                acc[story.idOnlineUser].push(story);
            }
        }
        return acc;
    }, {});


    const userStories = user && groupedStories[user.uid] ? [groupedStories[user.uid]] : [];
    const otherStories = Object.values(groupedStories).filter(group => group[0]?.idOnlineUser !== user?.uid);

    const storiesToShow = [...userStories, ...otherStories];

    return (
        <div className='Stories'>
            {storiesToShow.length > 0 ? (
                storiesToShow.map((group, groupIndex) => (
                    <Individualstory key={groupIndex} group={group} story={group[0]} />
                ))
            ) : (
                <h4>To view stories, the user must be registered on the hub and logged in. Additionally, the user must have connections (friends) in their connections list, and those friends must have posted stories.</h4>
            )}
        </div>

    );
};

export default Story;
