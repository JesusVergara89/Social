import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { toast } from 'react-toastify';
import { Timestamp, doc, setDoc } from "firebase/firestore";
import '../style/Comment.css';

const Comment = ({ postId, thispost, reload }) => {
    const [mainComment, setMainComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const postRef = doc(db, 'Post', postId);
            let updatedComments = [];

            if (thispost.comments[0].main) {
                const emptyOthers = {
                    one: { content: '', createdAt: null },
                    two: { content: '', createdAt: null },
                    three: { content: '', createdAt: null },
                    four: { content: '', createdAt: null },
                };

                updatedComments = [
                    {
                        createdAt: Timestamp.now().toDate(),
                        main: mainComment,
                        others: { ...emptyOthers }
                    },
                    ...thispost.comments,
                ];
            } else {
                updatedComments = [{
                    createdAt: Timestamp.now().toDate(),
                    main: mainComment,
                    others: {
                        one: { content: '', createdAt: null, userID: '' },
                        two: { content: '', createdAt: null, userID: '' },
                        three: { content: '', createdAt: null, userID: '' },
                        four: { content: '', createdAt: null, userID: '' },
                    }
                }, ...thispost.comments];
            }

            await setDoc(postRef, {
                ...thispost,
                comments: updatedComments
            });
            toast.success('Comment added successfully');
            reload()
            setMainComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };

    return (
        <div className="comments">
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    type="text"
                    className='main-comment'
                    placeholder="Add a comment..."
                    value={mainComment}
                    onChange={(e) => setMainComment(e.target.value)}
                />
                <button type="submit" className="submit-btn"><i className='bx bx-paper-plane'></i></button>
            </form>
        </div>
    );
}

export default Comment;
