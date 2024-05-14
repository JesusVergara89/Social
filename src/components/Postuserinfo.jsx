import React from 'react'
import '../style/Postuserinfo.css'

const Postuserinfo = ({p}) => {
    return (
        <div className="post-card-userinfo">
            <div className="post-card-userinfo-1">
                <img src={p.userPhoto} alt="" />
                <h6>{`${p.userName}`}</h6>
            </div>
            <div className="post-card-userinfo-2">
                <h6>{p.createdAt.toDate().toDateString()}</h6>
            </div>
        </div>
    )
}

export default Postuserinfo