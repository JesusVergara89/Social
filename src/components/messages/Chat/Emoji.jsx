import React from 'react';
import './Emoji.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const Emoji = ({ id, EMoji_Show, indexInfo, j, msg, user }) => {

    const handleClick = async (emoji) => {

        const messageDocRef = doc(db, 'Messages', id);

        try {
            const messageDoc = await getDoc(messageDocRef);

            if (messageDoc.exists()) {
                const messageData = messageDoc.data();
                const updatedEmojis = [...messageData.message[j].imgUp[1].emojisREACT, emoji];

                const updatedMessage = messageData.message.map((message, index) => {
                    if (index === j) {
                        return {
                            ...message,
                            imgUp: [
                                message.imgUp[0],
                                {
                                    ...message.imgUp[1],
                                    emojisREACT: updatedEmojis
                                }
                            ]
                        };
                    }
                    return message;
                });

                await updateDoc(messageDocRef, { message: updatedMessage });

                console.log('Emoji agregado correctamente en Firebase.');
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
