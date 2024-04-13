import { addDoc, arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebaseConfig"

const useSetMsgTimer = () => {

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

    const myTimes = (userID,data) => {
        for (let i = 0; i < timer.length; i++) {
            const timerData = timer[i].data;
            if (timerData) {
                const timerDocRef = doc(db, "timerMsg", timer[i].id);
                let newData = [...timerData];
                if (timerData.length >= 9) {
                    newData = timerData.slice(9);
                    updateDoc(timerDocRef, { data: newData })
                        .then(() => {
                            //console.log("Elementos eliminados correctamente");
                        })
                        .catch((error) => {
                            console.error("Error eliminando elementos:", error);
                        });
                }
                newData.push({ creatorID: userID, withwho: data, time: new Date() });
                updateDoc(timerDocRef, { data: newData })
                    .then(() => {
                        //console.log("Nuevo objeto agregado correctamente");
                    })
                    .catch((error) => {
                        console.error("Error agregando nuevo objeto:", error);
                    });
            }
        }
    };
    

    return { timer, myTimes }
}

export default useSetMsgTimer