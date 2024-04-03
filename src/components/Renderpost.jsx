import React from 'react'
import '../style/Renderpost.css'

const Renderpost = ({post}) => {
  return (
    <div className="renderpost">
        <img src={post.image} alt="" />
    </div>
  )
}

export default Renderpost