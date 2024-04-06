import useMypost from '../hooks/useMypost';
import '../style/Mypost.css'
import Renderpost from './Renderpost';
import { Link } from 'react-router-dom';

const Mypost = () => {

    const { myPost } = useMypost()
    //console.log(myPost.length)
    return (
        <div className="Mypost">
            {myPost &&
                myPost.map((post, i) => (
                    <Link to={`/singlepost/${post.id}`} key={i / 2}>
                        <Renderpost key={i} post={post} />
                    </Link>
                ))
            }
        </div>
    )
}

export default Mypost