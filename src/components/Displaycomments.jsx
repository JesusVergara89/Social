import React, { useState } from "react";
import '../style/Displaycomments.css'
import Subcomment from "./Subcomment";

const Displaycomments = ({ post }) => {
    const [updatedPost, setUpdatedPost] = useState(post);

    const handleSubcommentSubmit = (postId, updatedComments) => {
        // Encuentra el índice del post actualizado
        const index = updatedPost.findIndex(item => item.id === postId);
        // Actualiza el comentario en el post correspondiente
        const newPost = [...updatedPost];
        newPost[index].comments = updatedComments;
        // Actualiza el estado del post
        setUpdatedPost(newPost);
    };

    const extractComments = (posts) => {
        const allComments = [];
        posts.forEach(post => {
            if (post.comments) {
                allComments.push(...post.comments);
            }
        });
        return allComments;
    };

    const comments = extractComments(updatedPost);
    
    return (
        <div className="display-comments">
            {comments.length > 0 && (
                comments.map((comment, i) => (
                    <div key={i} className="display-comment-card">
                        <p className="comment-content">{comment.main}</p>
                        <p className="comment-date">{comment.createdAt && comment.createdAt.toDate().toDateString()}</p>
                        <Subcomment
                            postId={post[0].id}
                            post={updatedPost}
                            handleSubcommentSubmit={handleSubcommentSubmit}
                            index={i}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default Displaycomments;
