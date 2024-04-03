import React, { useState, useEffect } from "react";
import '../style/Displaycomments.css'
import Subcomment from "./Subcomment";
import Displaysubcomment from "./Displaysubcomment";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Displaycomments = ({ post, infousers }) => {

    const [comments, setComments] = useState([]);

    const [setshowcomments, setSetshowcomments] = useState(false)

    const [users, setUsers] = useState([]);

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

    const showComments = () => setSetshowcomments(!setshowcomments)

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

    return (
        <div className="display-comments">
            {setshowcomments ?
                comments.map((comment, i) => (
                    comment.main && (
                        <div key={i} className="display-comment-card">
                            <button onClick={showComments} className="hide-subcomments">Ocultar comentarios</button>
                            <p className="comment-content">{comment.main}</p>
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
                :
                <button onClick={showComments} className="show-subcomments">Ver comentarios</button>
            }
            {comments.length === 0 && (
                <p>No hay comentarios disponibles.</p>
            )}
        </div>
    );

}

export default Displaycomments;
