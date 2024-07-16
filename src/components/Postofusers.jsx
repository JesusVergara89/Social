import React from 'react'
import '../style/Mypost.css'
import usePostofuser from '../hooks/usePostofuser'
import { Link } from 'react-router-dom'
import Renderpost from './Renderpost'

const Postofusers = ({ id }) => {
    const { postProfile } = usePostofuser(id)

    return (
        <>
            {postProfile?.[0] ?
                <div className="Mypost">
                    {postProfile.map((post, i) => (
                        <Link to={`/singlepost/${post.id}`} key={i / 2}>
                            <Renderpost key={i} post={post} />
                        </Link>
                    ))}
                </div>
                : <div className='NonePublication'>
                    <i className='bx bx-camera' />
                    <h4>Aun no hay publicaciones</h4>
                </div>
            }
        </>
    )
}

export default Postofusers