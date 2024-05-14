import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { toast } from 'react-toastify';
import { Timestamp, doc, setDoc } from "firebase/firestore";
import '../style/Comment.css';
import { useAuthState } from "react-firebase-hooks/auth";

const Comment = ({ postId, thispost, reload }) => {

    const [mainComment, setMainComment] = useState('');
    const [userInfo] = useAuthState(auth)
    const [textareaHeight, setTextareaHeight] = useState('20px');

    useEffect(() => {
        const adjustTextareaHeight = () => {
            const length = mainComment.length;
            const minHeight = 20;
            const maxHeight = 300;
            const step = 30;

            let height = minHeight + Math.floor(length / 30) * step;
            height = Math.min(height, maxHeight);
            setTextareaHeight(height + 'px');
        };
        adjustTextareaHeight();
    }, [mainComment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mainComment.trim()) {
            toast.error('Please enter a comment');
            return;
        }
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
                        idUser: userInfo.uid,
                        others: { ...emptyOthers }
                    },
                    ...thispost.comments,
                ];
            } else {
                updatedComments = [{
                    createdAt: Timestamp.now().toDate(),
                    main: mainComment,
                    idUser: userInfo.uid,
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
                <textarea
                    className='main-comment'
                    placeholder="Add a comment..."
                    value={mainComment}
                    onChange={(e) => setMainComment(e.target.value)}
                    style={{ height: textareaHeight }}
                    rows={1}
                />
                <button type="submit" className="submit-btn"><i className='bx bxs-comment-edit' ></i></button>
            </form>
        </div>
    );
}

export default Comment;
