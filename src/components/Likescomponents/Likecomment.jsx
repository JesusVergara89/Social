import './Likecomment.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const Likecomment = ({ post, likes, index }) => {

    const [currentUser] = useAuthState(auth);

    const handleClick = async () => {
        const currentUserUid = currentUser?.uid;
        if (!currentUserUid) return;
        const postRef = doc(db, 'Post', post.id);
        try {
            const postDoc = await getDoc(postRef);
            if (postDoc.exists()) {
                const postData = postDoc.data();
                const comments = postData.comments || [];
                const updatedComments = comments.map((comment, i) => {
                    if (i === index) {
                        const newLikescomments = comment.likescomments || [];
                        if (newLikescomments.includes(currentUserUid)) {
                            return {
                                ...comment,
                                likescomments: newLikescomments.filter(uid => uid !== currentUserUid)
                            };
                        } else {
                            return {
                                ...comment,
                                likescomments: [...newLikescomments, currentUserUid]
                            };
                        }
                    }
                    return comment;
                });
                await updateDoc(postRef, { comments: updatedComments });
                console.log('Like actualizado exitosamente');
            } else {
                console.error('El documento del post no existe.');
            }
        } catch (error) {
            console.error('Error al actualizar el like:', error);
        }
    };

    return (
        <div className="Likepostcomment">
            <h6>{likes?.likescomments?.length}</h6>
            <i className={`fa fa-heart${!likes?.likescomments?.includes(currentUser?.uid) ? '-o' : ''} fa-lg`}
                style={{
                    cursor: 'pointer',
                    color: likes?.likescomments?.includes(currentUser?.uid) ? 'red' : null
                }}
                onClick={handleClick}
            />
        </div>
    );
}

export default Likecomment;
