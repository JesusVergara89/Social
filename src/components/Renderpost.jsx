import React from 'react'
import '../style/Renderpost.css'

const Renderpost = ({post}) => {
  return (
    <div className="renderpost">
        <img src={post.images[0]} alt="" />
    </div>
  )
}

export default Renderpost