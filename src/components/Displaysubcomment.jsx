import { useState } from 'react';
import '../style/Displaysubcomment.css';
import DeleteSubcomments from './DeleteSubcomments';
import LikesSubcom from './Likescomponents/LikesSubcom';

const Displaysubcomment = ({ comment, post, takeUserId }) => {
    const [showsubcomments, setShowsubcomments] = useState(false)

    const subcomments = Object.keys(comment.others).map(key => comment.others[key]);

    const formatCreatedAtDate = (sub) => {
        if (sub.createdAt && sub.createdAt.seconds) {
            const timestamp = sub.createdAt.seconds * 1000;
            const date = new Date(timestamp);
            return date.toDateString();
        }
        return '';
    }

    const subcommentsFormatted = subcomments.map(sub => ({
        ...sub,
        createdAt: formatCreatedAtDate(sub)
    }));

    const filterConteComment = subcommentsFormatted.reverse().filter(data => data.content != '')

    return (
        <div className="display-subcomment">
            {filterConteComment?.[0] ?
                <>
                    <button className="hide-subcomments" onClick={() => setShowsubcomments(prev => !prev)}>{showsubcomments ? 'Ocultar respuestas' : 'Ver respuestas'}</button>
                    {filterConteComment.map((sub, i) => (
                        showsubcomments &&
                        <div className='display-subcomment-container' key={i}>
                            <div className="inform-commet">
                                <DeleteSubcomments post={post} subcommentsFormatted={sub} />
                                <img src={sub.photo} className="PhotoAvatar" onClick={() => takeUserId(sub.userID)} />
                                <div className="comment-content-main">
                                    <p className="comment-userName" onClick={() => takeUserId(sub.userID)}>
                                        {`@${sub.userName}`}
                                    </p>
                                    <p className="comment-content">{sub.content}</p>
                                    <h4 className='comment-date'>{sub.createdAt}</h4>
                                </div>
                                <LikesSubcom post={post} sub={sub} />
                            </div>
                        </div>
                    ))}
                </>
                : ''
            }
        </div>
    );
};

export default Displaysubcomment;
