import React from 'react';
import './Emoji.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const Emoji = ({ id, EMoji_Show, indexInfo, j, msg, user }) => {

    const [userinfo] = useAuthState(auth)

    const handleClick = async (emoji) => {
        const messageDocRef = doc(db, 'Messages', id);
        try {
            const messageDoc = await getDoc(messageDocRef);

            if (messageDoc.exists()) {
                const messageData = messageDoc.data();
                const currentUserUid = userinfo.uid;
                const emojiObject = { emoji: emoji, userid: currentUserUid };
                let emojisREACT = messageData.message[j].imgUp[1].emojisREACT || [];
                const existingIndex = emojisREACT.findIndex(emoji => emoji.userid === currentUserUid);
                if (existingIndex !== -1) {
                    emojisREACT[existingIndex].emoji = emoji;
                } else {
                    emojisREACT.push(emojiObject);
                }
                const updatedMessage = messageData.message.map((message, index) => {
                    if (index === j) {
                        return {
                            ...message,
                            imgUp: [
                                message.imgUp[0],
                                {
                                    ...message.imgUp[1],
                                    emojisREACT: emojisREACT
                                }
                            ]
                        };
                    }
                    return message;
                });
                await updateDoc(messageDocRef, { message: updatedMessage });
            } else {
                console.error('El documento del mensaje no existe.');
            }
        } catch (error) {
            console.error('Error al agregar emoji:', error);
        }
    };

    return (
        <div className={msg.sender === user.uid ? `emoji-container-sender ${EMoji_Show === true && (indexInfo === j) ? '' : 'off-this'}` : `emoji-container-receptor ${EMoji_Show === true && (indexInfo === j) ? '' : 'off-this'}`}>
            {EMoji_Show && (indexInfo === j) &&
                <div className="emoji-comtainer-map">
                    {msg.imgUp[1]?.emojisDB.map((emoji, i) => (
                        <button onClick={() => handleClick(emoji)} key={i}>{emoji}</button>
                    ))}
                </div>
            }
        </div>
    )
}

export default Emoji;
