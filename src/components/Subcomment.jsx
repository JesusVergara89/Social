import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import '../style/Subcomment.css';
import { useAuthState } from 'react-firebase-hooks/auth';

const Subcomment = ({ post, handleSubcommentSubmit, index, setUpdateSubcomments, updateSubcomments }) => {
    const [othersComment, setOthersComment] = useState('');
    const [user] = useAuthState(auth);
    const [textareaHeight, setTextareaHeight] = useState('20px');


    useEffect(() => {
        const adjustTextareaHeight = () => {
            const length = othersComment.length;
            const lenthLine = (othersComment?.split('\n').length - 1) * 30
            const minHeight = 20;
            const maxHeight = 100;
            const step = 20;

            let height = minHeight + Math.floor((length + lenthLine) / 30) * step;
            height = Math.min(height, maxHeight);
            setTextareaHeight(height + 'px');
        };
        adjustTextareaHeight();
    }, [othersComment]);

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
                userID: user.uid,
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
        <form className='form-others'>
            <textarea
                type="text"
                className='others-comment'
                placeholder="Add Subcomment"
                value={othersComment}
                onChange={(e) => setOthersComment(e.target.value)}
                style={{ height: textareaHeight }}
                rows={1}
            />
            <button onClick={handleSubmitOthers} className="submit-btn"><i className='bx bx-paper-plane'></i></button>
        </form>
    )
}

export default Subcomment;


