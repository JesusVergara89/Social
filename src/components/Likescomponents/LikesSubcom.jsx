import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React from 'react'
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './LikesSubcom.css'

const LikesSubcom = ({post, sub, indexSub}) => {

    const [userOnline] = useAuthState(auth)

    const handleClick = async () => {
        const currentUserUid = userOnline?.uid;
        if (!currentUserUid) return;
    
        try {
            const docRef = doc(db, 'Post', post.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const commentsData = docSnap.data().comments;
                let keyFound = null;
                commentsData.forEach((comment, commentIndex) => {
                    for (let clave in comment.others) {
                        let data1 = comment.others[clave];
                        if (data1 && data1.content === sub.content && data1.userID === sub.userID) {
                            keyFound = { commentIndex, key: clave };
                            break;
                        }
                    }
                });  
                if (keyFound) {
                    const subComment = commentsData[keyFound.commentIndex].others[keyFound.key];
                    const likesSubComment = subComment.likesubcomment || [];
    
                    if (likesSubComment.includes(currentUserUid)) {
                        subComment.likesubcomment = likesSubComment.filter(uid => uid !== currentUserUid);
                    } else {
                        subComment.likesubcomment = [...likesSubComment, currentUserUid];
                    }
    
                    await updateDoc(docRef, { comments: commentsData });
                    
                } else {
                    console.log('No se encontró el subcomentario');
                }
            } else {
                console.error('El documento del post no existe.');
            }
        } catch (error) {
            console.error(error);
        }
    };
    
 
    return (
        <div className='LikesSubcom'>
            <h6>{sub?.likesubcomment?.length}</h6>
            <i className={`fa fa-heart${!sub?.likesubcomment?.includes(userOnline?.uid) ? '-o' : ''} fa-lg`}
                style={{
                    cursor: 'pointer',
                    color: sub?.likesubcomment?.includes(userOnline?.uid) ? 'red' : null
                }}
                onClick={handleClick}
            />
        </div>
    )
}

export default LikesSubcom