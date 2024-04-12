import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Allusers.css'
import Contactutility from './Contactutility';

const Allusers = () => {

    const [Allusers, setAllusers] = useState([])
    const [filtro, setFiltro] = useState('');
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

    const [thiIsTheCurrentUser] = useAuthState(auth)

    useEffect(() => {
        const usersCollectionRef = collection(db, 'Users');
        const q = query(usersCollectionRef, orderBy('userName'))
        onSnapshot(q, (snapshot) => {
            const allUsers = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAllusers(allUsers);
        })
    }, []);

    const handleInputChange = (event) => {
        const valor = event.target.value.toLowerCase();
        setFiltro(valor);
        const resultados = Allusers.filter(usuario =>
            usuario.userName.toLowerCase().includes(valor) || usuario.name.toLowerCase().includes(valor)
        );
        setUsuariosFiltrados(resultados);
    };
    //console.log(Allusers)
    return (
        <div className='all-users'>
            <div className="all-user-find">
                <input
                    type="text"
                    value={filtro}
                    onChange={handleInputChange}
                    placeholder="Buscar usuario..."
                />
                {filtro && usuariosFiltrados.length > 0 && (
                    <div>
                        {usuariosFiltrados.map(usuario => (
                            <div key={usuario.id}>{usuario.name} ({usuario.userName})</div>
                        ))}
                    </div>
                )}
            </div>
            {Allusers &&
                (
                    Allusers.map((user, i) => (
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
                            {thiIsTheCurrentUser?.uid === user.idUser ?
                                ''
                                :
                                <Contactutility idCurrentUser={thiIsTheCurrentUser?.uid} idUSER={user.idUser} />
                            }

                        </div>
                    ))
                )
            }
        </div>
    )
}

export default Allusers