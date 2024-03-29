import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import '../style/Subcomment.css';
import { useAuthState } from 'react-firebase-hooks/auth';

const Subcomment = ({ post, handleSubcommentSubmit, index, setUpdateSubcomments,updateSubcomments }) => {
    const [othersComment, setOthersComment] = useState('');
    const [user] = useAuthState(auth);

    const handleSubmitOthers = async (e) => {
        e.preventDefault();
        try {
            const postRef = doc(db, 'Post', post.id);
            const updatedComments = [...post.comments];
            const mainComment = updatedComments[index];

            if (!mainComment.main) {
                toast.error('Main comment does not exist');
                return;
            }

            const availableIndex = getAvailableCommentIndex(mainComment.others);
            if (availableIndex === null) {
                toast.error('Subcomments full');
                return;
            }

            mainComment.others[availableIndex] = {
                userID: user.uid, // Aquí se usa solo el ID del usuario
                content: othersComment,
                createdAt: Timestamp.now().toDate()
            };

            await setDoc(postRef, {
                ...post,
                comments: updatedComments
            });

            toast.success('Additional comment added successfully');
            setOthersComment('');
            setUpdateSubcomments(!updateSubcomments)
            handleSubcommentSubmit(updatedComments);
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
        <form className='form-others' onSubmit={handleSubmitOthers}>
            <input
                type="text"
                className='others-comment'
                placeholder="Add Subcomment"
                value={othersComment}
                onChange={(e) => setOthersComment(e.target.value)}
            />
            <button className='comment-btn' type="submit"><i className='bx bx-paper-plane'></i></button>
        </form>
    )
}

export default Subcomment;


