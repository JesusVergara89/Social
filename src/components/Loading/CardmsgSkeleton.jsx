import React from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from 'react-loading-skeleton'
const CardmsgSkeleton = () => {
    return (
        <>
            {Array(5).fill(0).map((x, index) =>
                <div key={index} className='card-user1'>
                    <Skeleton circle width={56} height={56} />
                    <div className='card-user-information'>
                        <Skeleton width={100} height={20} />
                        <Skeleton width={180} height={20} />
                    </div>
                </div>
            )}
        </>
    )
}

export default CardmsgSkeleton