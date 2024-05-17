import React from 'react'
import './Emojireactionlarger.css'

const Emojireactionlarger = ({ reaction }) => {
    console.log(reaction)
    return (
        <>
            {reaction?.[0] &&
                <div className="display-chat-img-larger-reactions">
                    {
                        reaction.map((data, i) => (
                            <div key={i}>
                                <i className='span1'>
                                    {data.emoji}
                                </i>
                                <p className='span2'>
                                    @{data.userName}
                                </p>
                            </div>
                        ))
                    }
                </div>}
        </>
    )
}

export default Emojireactionlarger