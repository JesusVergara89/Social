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

    const myTimes = (userID, data) => {
        if (timer) {
            const findingCorrectObject = timer.find(obj => obj.data[0].creatorID === user.uid);
            if (findingCorrectObject) {
                const timerDocRef = doc(db, "timerMsg", findingCorrectObject.id);
                const timerData = findingCorrectObject.data;
                let newData = [...timerData];
                if (timerData.length >= 7) {
                    newData = timerData.slice(7);
                }
                newData.push({ creatorID: userID, withwho: data, time: new Date() });
                updateDoc(timerDocRef, { data: newData })
                    .then(() => {
                        //console.log("Datos actualizados correctamente");
                    })
                    .catch((error) => {
                        console.error("Error al actualizar los datos:", error);
                    });
            }
        }
    };


    return { timer, myTimes }
}

export default useSetMsgTimer