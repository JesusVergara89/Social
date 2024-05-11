import React from 'react'
import './Emojireactionlarger.css'

const Emojireactionlarger = ({ reaction }) => {
    return (
        <div className="display-chat-img-larger-reactions">
            {
                reaction.map((data, i) => (
                        <i key={i}> <span className='span1'>{data.emoji}</span> <br/> <span className='span2'>@{data.userName}</span></i>
                ))
            }
        </div>
    )
}

export default Emojireactionlarger