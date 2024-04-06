import React from 'react'
import '../style/Mypost.css'
import usePostofuser from '../hooks/usePostofuser'
import { Link } from 'react-router-dom'
import Renderpost from './Renderpost'

const Postofusers = ({ id }) => {
    const { postProfile } = usePostofuser(id)
    
    return (
        <div className="Mypost">
            {postProfile &&
                postProfile.map((post, i) => (
                    <Link to={`/singlepost/${post.id}`} key={i / 2}>
                        <Renderpost key={i} post={post} />
                    </Link>
                ))
            }
        </div>
    )
}

export default Postofusers