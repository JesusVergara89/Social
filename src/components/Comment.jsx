import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { toast } from 'react-toastify';
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import '../style/Comment.css';

const Comment = ({ postId }) => {
    const [mainComment, setMainComment] = useState('');
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (postId) {
                    const docRef = doc(db, 'Post', postId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setPost({ ...docSnap.data(), id: docSnap.id });
                        setIsLoading(false);
                    } else {
                        setPost(null);
                    }
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (postId && isLoading) {
            fetchData();
        }
    }, [postId, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const postRef = doc(db, 'Post', post.id);
            let updatedComments = [];

            if (post.comments[0].main) {
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
                    ...post.comments,
                ];
            } else {
                updatedComments = [{
                    createdAt: Timestamp.now().toDate(),
                    main: mainComment,
                    others: {
                        one: { content: '', createdAt: null },
                        two: { content: '', createdAt: null },
                        three: { content: '', createdAt: null },
                        four: { content: '', createdAt: null },
                    }
                }, ...post.comments];
            }

            await setDoc(postRef, {
                ...post,
                comments: updatedComments
            });

            toast.success('Comment added successfully');
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
