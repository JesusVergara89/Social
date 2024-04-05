import React, { useEffect, useState } from 'react';
import '../style/Conections.css';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import Contactutility from './messages/Contactutility';

const Conections = () => {
    const [allrequest, setAllrequest] = useState([]);
    const [usersall, setUsersall] = useState([]);
    const [userlog] = useAuthState(auth);
    const [thiIsTheCurrentUser] = useAuthState(auth)

    useEffect(() => {
        const reqRef = collection(db, 'Users');
        const q = query(reqRef, orderBy('userName'));
        onSnapshot(q, (snapshot) => {
            const reqData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsersall(reqData);
        });

        const userRef = collection(db, 'Request');
        const q1 = query(userRef, orderBy('friendRequests'));
        onSnapshot(q1, (snapshot) => {
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllrequest(userData);
        });
    }, []);

    const myRequests = allrequest.filter((data, i) => {
        if ((data.friendRequests[0].id1 === userlog.uid || data.friendRequests[1].id2 === userlog.uid)
            && (data.friendRequests[0].status === true && data.friendRequests[1].status)) {
            return data.friendRequests
        }
    })

    const onlyFriendRequests = myRequests.map(data => data.friendRequests)

    //onlyFriendRequests[0][0].id1
    //onlyFriendRequests[0][1].id2
    //onlyFriendRequests[1][0].id1
    //onlyFriendRequests[1][1].id2

    const obtenerIds = (array) => {
        const ids = [];
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                ids.push(array[i][j]['id' + (j + 1)]);
            }
        }
        return ids;
    }

    const ids = obtenerIds(onlyFriendRequests);
    const idsMatchFriends = ids.filter(data => {
        if (data !== userlog.uid) {
            return data
        }
    })

    const findFriends = usersall.filter((data) => {
        for (let i = 0; i < idsMatchFriends.length; i++) {
            if (data.idUser === idsMatchFriends[i]) {
                return true;
            }
        }
        return false;
    });
    //console.log(findFriends);

    //console.log(example)

    return (
        <div className="connections">
            {findFriends &&
                (
                    findFriends.map((user, i) => (
                        <div key={i} className="all-users-mapeo">
                            <div className='all-users-profile-information'>
                                <div className="all-users-profile-information-image">
                                    <img src={user.photo} alt="" className="all-users-profile-image" />
                                </div>
                                <div className="all-users-profile-information-data">
                                    <h2 className="all-users-userid">{`@${user.userName}`}</h2>
                                    <h3 className="all-users-name">{user.name}</h3>
                                    <p className="all-users-bio">{user.bio}</p>
                                </div>
                            </div>
                            <Contactutility idCurrentUser={thiIsTheCurrentUser?.uid} idUSER={user.idUser} />
                        </div>
                    ))
                )
            }
        </div>
    );
};

export default Conections;
