import React from 'react'
import './Emoji.css'

const Emoji = ({ EMoji_Show, indexInfo, j, msg, user }) => {
    return (
        <div className={msg.sender === user.uid ? "emoji-container-sender" : "emoji-container-receptor"}>
            {EMoji_Show && (indexInfo === j) ?
                <div className="emoji-comtainer-map">
                    {msg.imgUp[1].emojisDB.map((emoji, i) => (
                        <button key={i}>{emoji}</button>
                    ))}
                </div>
                :
                ''
            }
        </div>
    )
}

export default Emoji