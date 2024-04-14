import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { setRequestValue } from '../store/slices/request.slice';
import { setConectionValue } from '../store/slices/conections.slice';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { setMsgValue } from '../store/slices/countermsg.slice';

const Invisiblecomp = () => {

    const dispatch = useDispatch();
    const [pending, setPending] = useState([]);
    const [myPending, setMyPending] = useState([]);
    const [friends, setFriends] = useState([]);
    const [matchFriends, setMatchFriends] = useState([]);
    const [user] = useAuthState(auth);
    const [timer, setTimer] = useState()
    const [allmsg, setAllmsg] = useState();
    const [lastAll, setLastall] = useState();

    const setSpecific = (value) => dispatch(setRequestValue(value));
    const setFriendValue = (value) => dispatch(setConectionValue(value));
    const setMesgValue = (value) => dispatch(setMsgValue(value));

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Request'), (snapshot) => {
            const requests = snapshot.docs.map((doc) => {
                const { createdAt, ...dataWithoutCreatedAt } = doc.data();
                return { id: doc.id, ...dataWithoutCreatedAt };
            });
            setPending(requests);
        });

        const matchreqRef = collection(db, 'Request');
        const q1 = query(matchreqRef, orderBy('friendRequests'));
        const unsubscribeMatchReq = onSnapshot(q1, (snapshot) => {
            const request = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setFriends(request);
        });

        const timerRef = collection(db, "timerMsg")
        const q2 = query(timerRef, orderBy("data"))
        onSnapshot(q2, (snapshot) => {
            const timers = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setTimer(timers)
        })


        const messagesRef = collection(db, 'Messages')
        const q3 = query(messagesRef, orderBy('message'))
        onSnapshot(q3, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAllmsg(msgs)
        })

        const lasRef = collection(db, 'lasMsg')
        const q4 = query(lasRef, orderBy('data'))
        onSnapshot(q4, (snapshot) => {
            const last = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setLastall(last)
        })

        return () => {
            unsubscribe();
            unsubscribeMatchReq();
        };
    }, []);


    useEffect(() => {
        if (timer && allmsg && user && lastAll) {
            const userMsgs = allmsg.filter(msg => {
                msg.message = msg.message.filter(m => m.receptor === user.uid);
                return msg.message.length > 0;
            });

            const findingCorrectObject = timer.find(obj => obj.data[0].creatorID === user.uid);
            const lastMsgData = lastAll.find(obj => obj.data[0].creatorID === user.uid);

            if (userMsgs.length > 0 && findingCorrectObject) {
                const lastUserMsg = userMsgs[userMsgs.length - 1].message[userMsgs[userMsgs.length - 1].message.length - 1];
                const lastTimerObj = findingCorrectObject.data[findingCorrectObject.data.length - 1];
                console.log(lastTimerObj)
                const timestamp1 = lastUserMsg.createdAt.toDate();
                const timestamp2 = lastTimerObj.time.toDate();

                if (timestamp1 > timestamp2) {
                    setMesgValue(1)
                    if (findingCorrectObject && lastTimerObj && lastMsgData) {
                        const timerDocRef = doc(db, "lasMsg", lastMsgData.id);
                        const timerData = lastMsgData.data;
                        let newData = [...timerData];
                        if (timerData.length >= 7) {
                            newData = timerData.slice(5);
                        }
                        newData.push({ creatorID: lastTimerObj.creatorID, withwho: lastTimerObj.withwho, time: new Date() });
                        updateDoc(timerDocRef, { data: newData })
                            .then(() => {
                                //console.log("Datos actualizados correctamente");
                            })
                            .catch((error) => {
                                console.error("Error al actualizar los datos:", error);
                            });
                    }
                } else if (timestamp1 < timestamp2) {
                    setMesgValue(0)
                } else {
                    setMesgValue(0)
                }
            } else {
                console.log("No hay mensajes del usuario o no se encontró el objeto correcto en timer.");
            }
        }
    }, [timer, allmsg]);

    /*code for msg notifications*/

    useEffect(() => {
        if (pending.length > 0 && user) {
            const userPending = pending.filter(pen =>
                pen.friendRequests.some(data => data.id1 === user.uid || data.id2 === user.uid)
            );
            const matchFriends = friends.filter(data => {
                if ((data.friendRequests[0]?.id1 === user.uid || data.friendRequests[1]?.id2 === user.uid) &&
                    (data.friendRequests[0]?.status === true && data.friendRequests[1]?.status === true)) {
                    return data;
                } else {
                    return null;
                }
            });
            setMatchFriends(matchFriends);
            setMyPending(userPending.length > 0 ? userPending : []);
        }

    }, [pending, user, friends]);

    useEffect(() => {
        const friendshipStatus = myPending.map(pendingItem => ({
            id: pendingItem.id,
            status1: pendingItem.friendRequests[0]?.status,
            status2: pendingItem.friendRequests[1]?.status
        }));

        const acceptedRequests = friendshipStatus.filter(data => data.status1 === null && data.status2 === true);
        setSpecific(acceptedRequests.length);
        setFriendValue(matchFriends.length);
    }, [myPending, matchFriends]);

    return (
        <div style={{ position: 'absolute', top: '-550px' }}>{`Invisiblecomp ${friends}`}</div>
    );
};

export default Invisiblecomp;
