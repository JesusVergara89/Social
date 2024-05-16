import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { toast } from 'react-toastify';
import { Timestamp, doc, setDoc } from "firebase/firestore";
import '../style/Comment.css';
import { useAuthState } from "react-firebase-hooks/auth";
import { CurrentUsercontext } from './Context/CurrentUsercontext';
import { useNavigate } from "react-router-dom";

const Comment = ({ postId, thispost, reload, UserResponse, setUserResponse, handleSubcommentSubmit, setUpdateSubcomments, updateSubcomments }) => {
    const navigate = useNavigate();
    const [mainComment, setMainComment] = useState('');
    const [userInfo] = useAuthState(auth)
    const [textareaHeight, setTextareaHeight] = useState('20px');
    const { CurrentUser } = useContext(CurrentUsercontext)
    useEffect(() => {
        const adjustTextareaHeight = () => {
            const length = mainComment.length;
            const lenthLine = (mainComment?.split('\n').length - 1) * 30
            const minHeight = 20;
            const maxHeight = 100;
            const step = 20;
            let height = minHeight + Math.floor((length + lenthLine) / 30) * step;
            height = Math.min(height, maxHeight);
            setTextareaHeight(height + 'px');
        };
        adjustTextareaHeight();
    }, [mainComment]);

    const handleSubmit = (e) => {
        if (userInfo) {
            if (UserResponse) {
                FunctionResponse(e)
            } else {
                FunctioComment(e)
            }
        } else {
            navigate('/login')
        }

    };

    const reset = () => {
        setUserResponse(null)
    }

    const FunctioComment = async (e) => {
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
                        idUser: userInfo.uid,
                        userName: CurrentUser.userName,
                        photo: CurrentUser.photo,
                        others: { ...emptyOthers }
                    },
                    ...thispost.comments,
                ];
            } else {
                updatedComments = [{
                    createdAt: Timestamp.now().toDate(),
                    main: mainComment,
                    idUser: userInfo.uid,
                    userName: CurrentUser.userName,
                    photo: CurrentUser.photo,
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
    }
    const FunctionResponse = async (e) => {
        e.preventDefault();
        try {
            const postRef = doc(db, 'Post', postId);
            const updatedComments = [...thispost.comments];
            const mainComment_Response = updatedComments[UserResponse.index];

            if (!mainComment_Response.main) {
                toast.error('Main comment does not exist');
                return;
            }

            const availableIndex = getAvailableCommentIndex(mainComment_Response.others);
            if (availableIndex === null) {
                toast.error('Subcomments full');
                return;
            }

            mainComment_Response.others[availableIndex] = {
                userID: userInfo.uid,
                userName: CurrentUser.userName,
                photo: CurrentUser.photo,
                content: mainComment,
                createdAt: Timestamp.now().toDate()
            };

            await setDoc(postRef, {
                ...thispost,
                comments: updatedComments
            });

            toast.success('Additional comment added successfully');
            setMainComment('');
            setUpdateSubcomments(!updateSubcomments)
            handleSubcommentSubmit(updatedComments);
            setUserResponse(null)
        } catch (error) {
            console.error('Error adding additional comment:', error);
            toast.error('Failed to add additional comment');
        }
    }
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
        <div className="comments">
            {UserResponse &&
                <div className="Information-response">
                    <img src={UserResponse.photo} className="PhotoAvatar" />
                    <p>{`Respondiendo a @${UserResponse.userName}`}</p>
                    <i className='bx bx-x' onClick={reset} />
                </div>
            }
            <form className="form-container">
                <textarea
                    className='main-comment'
                    placeholder={UserResponse ? "Add Subcomment..." : "Add a comment..."}
                    value={mainComment}
                    onChange={(e) => setMainComment(e.target.value)}
                    style={{ height: textareaHeight }}
                    rows={1}
                />
                <button onClick={handleSubmit} className="submit-btn"><i className='bx bx-paper-plane'></i></button>
            </form>
        </div>
    );
}

export default Comment;
