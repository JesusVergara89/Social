import useMypost from '../hooks/useMypost';
import '../style/Mypost.css'
import Renderpost from './Renderpost';
import { Link } from 'react-router-dom';

const Mypost = () => {

    const { myPost } = useMypost()
    return (
        <>
            {myPost?.[0] ?
                <div className="Mypost">
                    {myPost.map((post, i) => (
                        <Link to={`/singlepost/${post.id}`} key={i / 2}>
                            <Renderpost key={i} post={post} />
                        </Link>
                    ))}
                </div>
                :
                <div className='NonePublication'>
                    <i className='bx bx-camera' />
                    <h4>Aun no hay publicaciones</h4>
                </div>}
        </>
    )
}

export default Mypost