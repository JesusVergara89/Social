import React from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from 'react-loading-skeleton'
const DisplaychatSkeleton = () => {
    return (
            <div className='display-chat'>
                <div className='display-chat-information'>
                    <div className='single-card-msg-close'>
                        <i className='bx bx-left-arrow-alt' />
                    </div>
                    <Skeleton circle width={44} height={44} />
                    <Skeleton width={100} height={20} />
                </div>
                <div className='display-chat-messages'>
                    <Skeleton width={'100%'} height={'50vh'} />
                </div>
            </div>
    )
}

export default DisplaychatSkeleton