import React, { useState, useEffect } from "react";
import '../style/Displaycomments.css'
import Subcomment from "./Subcomment";
import Displaysubcomment from "./Displaysubcomment";

const Displaycomments = ({ post }) => {
    const [comments, setComments] = useState([]);

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
            {comments.length > 0 && (
                comments.map((comment, i) => (
                    <div key={i} className="display-comment-card">
                        <p className="comment-content">{comment.main}</p>
                        <p className="comment-date">{comment.createdAt && comment.createdAt.toDate().toDateString()}</p>
                        <Subcomment
                            post={post}
                            handleSubcommentSubmit={handleSubcommentSubmit}
                            index={i}
                        />
                        <Displaysubcomment comment={comment} index={i} post={post}/>
                    </div>
                ))
            )}
        </div>
    );
};

export default Displaycomments;
