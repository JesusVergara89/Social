import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import '../style/Subcomment.css';

const Subcomment = ({ postId, post, handleSubcommentSubmit, index }) => {
    const [othersComment, setOthersComment] = useState('');

    const handleSubmitOthers = async (e) => {
        e.preventDefault();
        try {
            const postRef = doc(db, 'Post', postId);

            if (post[0].comments[index].main) {
                const others = { ...post[0].comments[index].others };
                const availableCommentIndex = getAvailableCommentIndex(others);

                if (availableCommentIndex === null) {
                    toast.error('Subcomments full');
                    return;
                }

                others[availableCommentIndex] = {
                    content: othersComment,
                    createdAt: Timestamp.now().toDate()
                };

                const updatedComments = [...post[0].comments];
                updatedComments[index] = {
                    ...updatedComments[index],
                    others: others
                };

                await setDoc(postRef, {
                    ...post[0],
                    comments: updatedComments
                });

                toast.success('Additional comment added successfully');
                setOthersComment('');
                handleSubcommentSubmit(postId, updatedComments);
            } else {
                toast.error('Main comment does not exist');
            }
        } catch (error) {
            console.error('Error adding additional comment:', error);
            toast.error('Failed to add additional comment');
        }
    };

    const getAvailableCommentIndex = (others) => {
        const availableComments = ['one', 'two', 'three', 'four'];
        for (const comment of availableComments) {
            if (!others[comment].content) {
                return comment;
            }
        }
        return null;
    };

    return (
        <form onSubmit={handleSubmitOthers}>
            <input
                type="text"
                className='others-comment'
                placeholder="Others Comment"
                value={othersComment}
                onChange={(e) => setOthersComment(e.target.value)}
            />
            <button className='comment-btn' type="submit">Add Comment</button>
        </form>
    )
}

export default Subcomment;
