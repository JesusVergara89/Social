import React from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from 'react-loading-skeleton'
import Loader from './Loader'
const PostSkeleton = () => {
    return (
        <>
            {Array(3).fill(0).map((x, index) =>
                <div key={index} className="post-card">
                    <div className="post-card-img-container">
                        <Skeleton height={500} width={350} />
                    </div>
                    <div className="post-card-userinfo">
                        <Skeleton height={15} width={30} style={{ position: 'absolute',top:'-8px', right:'15px' }} />
                        <div className="post-card-userinfo-1">
                            <Skeleton circle width={40} height={40} />
                            <Skeleton width={80} height={25} />
                        </div>
                        <div className="post-card-userinfo-2">
                            <Skeleton width={100} height={25} />
                        </div>
                    </div>
                    <Skeleton height={180} width={320} style={{marginTop:'10px'}}/>
                </div>
            )}
            <Loader />
        </>
    )
}

export default PostSkeleton