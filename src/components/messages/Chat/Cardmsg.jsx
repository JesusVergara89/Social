import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Cardmsg.css'

const Cardmsg = () => {
    
    const [user] = useAuthState(auth);
    const [allmsg, setAllmsg] = useState();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Messages'));
                const documentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllmsg(documentsData);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
        };
        fetchDocuments();
    }, []);

    const userMsgs = allmsg?.filter(data => {
        if (Array.isArray(data.message) && data.message.length > 0) {
            for (let i = 0; i < data.message.length; i++) {
                if (data.message[i].sender === user.uid || data.message[i].receptor === user.uid) {
                    return true;
                }
            }
        }
        return false;
    });

    //console.log(userMsgs)

    return (
        <div className="card-msg">
            <h3 className='card-msg-title'>tus mensajes con otros usuarios:</h3>
            {userMsgs && userMsgs.map((msg, i) => (
                <div key={i} className='card-msg-info'>
                    <div className="card-user1">
                        <img src={msg.message[0].photoR} alt="" />
                        <h4>{`@${msg.message[0].userNameR}`}</h4>
                    </div>
                    <div className="card-user1">
                    <img src={msg.message[0].photoS} alt="" />
                    <h4>{`@${msg.message[0].userNameS}`}</h4>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Cardmsg;
