import React, { useState, useEffect } from "react";
import '../style/Displaycomments.css'
import Displaysubcomment from "./Displaysubcomment";
import DeleteComment from "./DeleteComment";
import Likecomment from "./Likescomponents/Likecomment";
import Comment from "./Comment";

const Displaycomments = ({ post, reload }) => {
    const [UserResponse, setUserResponse] = useState()
    const [comments, setComments] = useState([]);
    const [setshowcomments, setSetshowcomments] = useState(false)
    const [updateSubcomments, setUpdateSubcomments] = useState(false)
    const showComments = () => setSetshowcomments(!setshowcomments)

    useEffect(() => {
        if (post && post.comments && Array.isArray(post.comments)) {
            setComments(post.comments);
        } else {
            setComments([]);
        }
    }, [post, updateSubcomments]);

    const handleSubcommentSubmit = (updatedComments) => {
        setComments(updatedComments);
    };
    const FunctionUserResponse = (i, user, photo) => {
        setUserResponse({ index: i, userName: user, photo: photo })
    }
    return (
        <div className="display-comments">
            {setshowcomments ?
                <>
                    <button onClick={showComments} className="hide-subcomments">Ocultar comentarios</button>
                    {comments.map((comment, i) => (
                        comment.main && (
                            <div key={i} className="display-comment-card">
                                <div className="inform-commet">
                                    <img src={comment.photo} className="PhotoAvatar" />
                                    <div className="comment-content-main">
                                        <p className="comment-date">
                                            {`@${comment.userName}`}
                                        </p>
                                        <p className="comment-content">{comment.main}</p>
                                        <DeleteComment post={post} commentPosition={i} />
                                        <div className="respond">
                                            <p className="comment-date">{comment.createdAt && comment.createdAt.toDate().toDateString()}
                                            </p>
                                            <button onClick={() => FunctionUserResponse(i, comment.userName, comment.photo)}>Responder</button>
                                        </div>
                                    </div>
                                    <Likecomment post={post} index={i} likes={comment} />
                                </div>
                                <Displaysubcomment comment={comment} post={post} />
                            </div>
                        )
                    ))
                    }
                    {comments.length - 1 === 0 && (
                        <p className="noneComment">No hay comentarios disponibles. Se el primero en comentar.</p>
                    )}
                </>
                :
                <button onClick={showComments} className="show-subcomments">Ver comentarios</button>
            }
            <Comment
                UserResponse={UserResponse}
                setUserResponse={setUserResponse}
                thispost={post}
                postId={post.id}
                reload={reload}
                setUpdateSubcomments={setUpdateSubcomments}
                updateSubcomments={updateSubcomments}
                handleSubcommentSubmit={handleSubcommentSubmit}
            />
        </div>
    );

}

export default Displaycomments;
