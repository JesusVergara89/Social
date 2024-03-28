import React, { useState, useEffect } from "react";
import '../style/Displaycomments.css'
import Subcomment from "./Subcomment";
import Displaysubcomment from "./Displaysubcomment";

const Displaycomments = ({ post }) => {
    const [comments, setComments] = useState([]);

    const [setshowcomments, setSetshowcomments] = useState(false)

    const showComments = () => setSetshowcomments(!setshowcomments)

    useEffect(() => {
        if (post && post.comments && Array.isArray(post.comments)) {
            setComments(post.comments);
        } else {
            setComments([]);
        }
    }, [post]);

    const handleSubcommentSubmit = (updatedComments) => {
        setComments(updatedComments);
    };

    return (
        <div className="display-comments">
            {setshowcomments ?
                comments.map((comment, i) => (
                    comment.main && (
                        <div key={i} className="display-comment-card">
                            <button onClick={showComments} className="hide-subcomments">Ocultar comentarios</button>
                            <p className="comment-content">{comment.main}</p>
                            <p className="comment-date">{comment.createdAt && comment.createdAt.toDate().toDateString()}</p>
                            <Subcomment
                                post={post}
                                handleSubcommentSubmit={handleSubcommentSubmit}
                                index={i}
                            />
                            <Displaysubcomment comment={comment} index={i} post={post} />
                        </div>
                    )
                ))
                :
                <button onClick={showComments} className="show-subcomments">Ver comentarios</button>
            }
            {comments.length === 0 && (
                <p>No hay comentarios disponibles.</p>
            )}
        </div>
    );

}

export default Displaycomments;
