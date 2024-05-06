import React from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from 'react-loading-skeleton'
import Loader from './Loader'
const PostSkeleton = () => {
    return (
        <>
            {Array(3).fill(0).map((x, index) =>
                <div key={index} className="post-card">
                    <div className="post-card-userinfo">
                        <div className="post-card-userinfo-1">
                            <Skeleton circle width={40} height={40} />
                            <Skeleton width={80} height={25} />
                        </div>
                        <div className="post-card-userinfo-2">
                            <Skeleton width={100} height={25} />
                        </div>
                    </div>
                    <div className="post-card-img-container">
                        <Skeleton height={500} width={'100vw'} />
                    </div>
                    <div className='post-card-action'>
                        <Skeleton width={38} height={24} />
                        <Skeleton width={38} height={24} />
                    </div>
                    <p className='post-card-description'>
                        <Skeleton height={180} style={{ marginTop: '10px' }} />
                    </p>
                </div>
            )}
            <Loader />
        </>
    )
}

export default PostSkeleton