import React from 'react'
import './Emojireactions.css'

const Emojireactions = ({user,msg}) => {
    return (
        <div className={msg.sender === user.uid ? `container-msg-with-img-emojis-reaction-sender ${msg.imgUp[1].emojisREACT.length <= 0 ? 'off-this' : ''}` : `container-msg-with-img-emojis-reaction-receptor ${msg.imgUp[1].emojisREACT.length <= 0 ? 'off-this' : ''}`} >
            {
                msg.imgUp[1].emojisREACT.slice(-8).map((data, i) => (
                    <i key={i}>{data?.emoji}</i>
                ))
            }
        </div>
    )
}

export default Emojireactions