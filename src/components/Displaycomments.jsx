import React, { useState, useEffect } from "react";
import '../style/Displaycomments.css'
import Subcomment from "./Subcomment";
import Displaysubcomment from "./Displaysubcomment";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import DeleteComment from "./DeleteComment";
import Likecomment from "./Likescomponents/Likecomment";

const Displaycomments = ({ post, infousers }) => {

    const [comments, setComments] = useState([]);

    const [users, setUsers] = useState([]);

    const [setshowcomments, setSetshowcomments] = useState(false)

    const [updateSubcomments, setUpdateSubcomments] = useState(false)

    useEffect(() => {
        const messagesRef = collection(db, 'Users')
        const q = query(messagesRef, orderBy('userName'))
        onSnapshot(q, (snapshot) => {
            const userx = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setUsers(userx)
        })
    }, [comments, updateSubcomments]);

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

    const userNameIdArray = infousers.map(user => ({
        userName: user.userName,
        idUser: user.idUser
    }));

    const showComments = () => {
        setSetshowcomments(!setshowcomments)
    }

    return (
        <div className="display-comments">
            {
                setshowcomments ? (
                    comments.map((comment, i) => (
                        comment.main && (
                            <div key={i} className="display-comment-card">
                                <button onClick={showComments} className="hide-subcomments">Ocultar comentarios</button>
                                <p className="comment-content">{comment.main}</p>
                                <Likecomment post={post} index={i} likes={comment} />
                                <DeleteComment post={post} commentPosition={i} />
                                <p className="comment-date">
                                    {`@${userNameIdArray.find(match => match.idUser === comment.idUser)?.userName || ''}`}
                                </p>
                                <p className="comment-date">{comment.createdAt && comment.createdAt.toDate().toDateString()}</p>
                                <Subcomment
                                    post={post}
                                    handleSubcommentSubmit={handleSubcommentSubmit}
                                    index={i}
                                    setUpdateSubcomments={setUpdateSubcomments}
                                    updateSubcomments={updateSubcomments}
                                />
                                <Displaysubcomment users={users} comment={comment} index={i} post={post} />
                            </div>
                        )
                    ))
                ) : (
                    post.comments.length > 1 ? (
                        <div onClick={showComments} className="display-comments-there-is-not-comments">
                            <h5>{`Ver ${post.comments.length - 1} mensajes`}</h5>
                        </div>
                    ) : (
                        <div className="display-comments-there-is-not-comments">
                            <h6>Aun no hay comentarios, sé el primero en opinar...</h6>
                        </div>
                    )
                )
            }
        </div>
    );

}

export default Displaycomments;
