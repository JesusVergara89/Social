import { addDoc, arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebaseConfig"

const useSetMsgTimer = (user) => {

    const [timer, setTimer] = useState()

    useEffect(() => {
        const timerRef = collection(db, "timerMsg")
        const q = query(timerRef, orderBy("data"))
        onSnapshot(q, (snapshot) => {
            const timers = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setTimer(timers)
        })
    }, [])

    const myTimes = (creatorID, receptorID, userNameR, userNameS) => {
        if (timer) {
            const EnterTestExistance = timer.find(obj => {
                return obj.data[0].creatorID === user.uid && obj.data[0].receptorID === ''
            });
            if (EnterTestExistance !== undefined) {
                const timerDocRef = doc(db, "timerMsg", EnterTestExistance.id);
                const timerData = EnterTestExistance.data;
                let newData = [...timerData];
                if (timerData.length >= 7) {
                    newData = timerData.slice(7);
                }
                newData.push({ creatorID: creatorID, receptorID: receptorID, userNameS: userNameS, userNameR: userNameR, time: new Date()});
                updateDoc(timerDocRef, { data: newData })
                    .then(() => {
                        //console.log("Datos actualizados correctamente");
                    })
                    .catch((error) => {
                        console.error("Error al actualizar los datos:", error);
                    });

            } else {
                const findingCorrectObject = timer.find(obj => {
                    return obj.data[0].creatorID === user.uid && obj.data[0].receptorID === receptorID || obj.data[0].creatorID === creatorID && obj.data[0].receptorID === user.uid || obj.data[0].creatorID === receptorID && obj.data[0].receptorID === creatorID;
                });
                //console.log(findingCorrectObject)
                if (findingCorrectObject) {
                    const timerDocRef = doc(db, "timerMsg", findingCorrectObject.id);
                    const timerData = findingCorrectObject.data;
                    let newData = [...timerData];
                    if (timerData.length >= 7) {
                        newData = timerData.slice(7);
                    }
                    newData.push({ creatorID: creatorID, receptorID: receptorID, userNameS: userNameS, userNameR: userNameR, time: new Date() });
                    updateDoc(timerDocRef, { data: newData })
                        .then(() => {
                            //console.log("Datos actualizados correctamente");
                        })
                        .catch((error) => {
                            console.error("Error al actualizar los datos:", error);
                        });
                }
            }


        }
    };


    return { timer, myTimes }
}

export default useSetMsgTimer