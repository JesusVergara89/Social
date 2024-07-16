import '../style/Header.css'
import social from '../images/Social.png'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import nullphoto from '../images/nullprofile.svg'
import { useSelector } from 'react-redux'
import { addDoc, collection, updateDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import useSound from 'use-sound';
import recieved from '../Sound/received.mp3';
const Header = () => {
    const [play] = useSound(recieved);
    const [currentlyLoggedinUser] = useAuthState(auth);
    const navigate = useNavigate()
    const conexionNumber = useSelector(state => state.conectionNumber)
    const [Message, setMessage] = useState([])
    const [counMessage, setcounMessage] = useState(0)
    useEffect(() => {
        if (currentlyLoggedinUser) {
            const querySnapshot = collection(db, 'Messages');
            const q = query(querySnapshot, orderBy('message'))
            onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setMessage(msgs);
            })
        }
    }, [currentlyLoggedinUser]);
    const arrayMessagesToUpdate = Message.filter(data => (data.message[0].sender === currentlyLoggedinUser?.uid || data.message[0].receptor === currentlyLoggedinUser?.uid))
    const CountMessage = (msg) => {
        let count = msg.filter(item => item.message[item.message.length - 1].receptor === currentlyLoggedinUser?.uid && item.message[item.message.length - 1].showMessage === false).length
        return count
    }
    const UpdateShowNotice = () => {
        arrayMessagesToUpdate?.map(async (data) => {
            const messageId = data.id;
            const messageRef = doc(db, 'Messages', messageId);
            let NewMessagePush = []
            let check = false
            data.message.map(dataMessage => {
                let dataT
                dataMessage.receptor === currentlyLoggedinUser?.uid && dataMessage.showNotice === false ?
                    (dataT = { ...dataMessage, showNotice: true }, check = true, play()) : dataT = { ...dataMessage }
                NewMessagePush.push(dataT)
            })
            if (check) {
                await updateDoc(messageRef, { message: NewMessagePush });
            }
        })
    }

    useEffect(() => {
        setcounMessage(() => CountMessage(arrayMessagesToUpdate))
        UpdateShowNotice()
    }, [Message])

    return (
        <header>
            <div onClick={() => navigate('/')} className="logo">
                <img src={social} alt="" />
            </div>
            <div className="menu">
                <Link to={'/createpost'}>
                    <div className="menu-menu create not-activate">
                        <i className='bx bxs-plus-square'></i>
                        <h5>New post</h5>
                    </div>
                </Link>
                <Link to={'/allusers'}>
                    <div className="menu-alluser">
                        <i className='bx bxs-grid'></i>
                    </div>
                </Link>
                <Link to={'/messagesinbox'}>
                    <div className="menu-menu">
                        <i className='bx bx-message-detail'></i>
                        {counMessage > 0 && currentlyLoggedinUser ?
                            <div className='conection-counter'>
                                <h6>{counMessage}</h6>
                            </div>
                            : ''}
                    </div>
                </Link>
                <Link to={'/conections'} >
                    <div className="menu-menu">
                        <i className='bx bx-group'></i>
                        {conexionNumber > 0 && currentlyLoggedinUser ? <div className={conexionNumber <= 10 ? "conection-counter" : "conection-counter-grosse"}>
                            <h6>{conexionNumber}</h6>
                        </div> : ''}
                    </div>
                </Link>
                <Link to={'/profile'}>
                    <div className="menu-profile">
                        <img src={currentlyLoggedinUser === null ? nullphoto : currentlyLoggedinUser?.photoURL} alt="" />
                        <h5>{currentlyLoggedinUser === null ? 'Inicia sesión' : currentlyLoggedinUser?.displayName}</h5>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default Header