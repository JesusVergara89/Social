import React, { useState, useEffect } from "react";
import '../style/Displaycomments.css'
import Subcomment from "./Subcomment";
import Displaysubcomment from "./Displaysubcomment";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Displaycomments = ({ post }) => {

    const [comments, setComments] = useState([]);

    const [setshowcomments, setSetshowcomments] = useState(false)
 
    const [users, setUsers] = useState([]);  

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Users'));
                const documentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(documentsData);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
        };
        fetchDocuments();
    }, [comments]);

    const showComments = () => setSetshowcomments(!setshowcomments)

    useEffect(() => {
        if (post && post.comments && Array.isArray(post.comments)) {
            setComments(post.comments);
        } else {
            setComments([]);
        }
    }, [post]);

    const handleSubcommentSubmit = (updatedComments) => {
        setComments(updatedComments);
    };

    return (
        <div className="display-comments">
            {setshowcomments ?
                comments.map((comment, i) => (
                    comment.main && (
                        <div key={i} className="display-comment-card">
                            <button onClick={showComments} className="hide-subcomments">Ocultar comentarios</button>
                            <p className="comment-content">{comment.main}</p>
                            <p className="comment-date">{comment.createdAt && comment.createdAt.toDate().toDateString()}</p>
                            <Subcomment
                                post={post}
                                handleSubcommentSubmit={handleSubcommentSubmit}
                                index={i}
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
