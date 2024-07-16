import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Allusers.css'
import Filtereduser from '../Filtereduser';

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
            (usuario.userName.toLowerCase().includes(valor) || usuario.name.toLowerCase().includes(valor)) && (usuario.idUser != thiIsTheCurrentUser?.uid)
        );
        setUsuariosFiltrados(resultados);
    };
    return (
        <div className='all-users'>
            {thiIsTheCurrentUser !== null ? <p className='all-users-explanations'>Encuentra conexiones por nombre o usuario</p> : ''}
            {thiIsTheCurrentUser !== null ?
                <div className="all-user-find">
                    <div className="all-user-find-inner">
                        <input
                            id='inputfind'
                            type="text"
                            value={filtro}
                            onChange={handleInputChange}
                            placeholder="Buscar usuario..."
                        />
                        <div className="user-find">
                            <i className='bx bx-search'></i>
                        </div>
                    </div>

                    {filtro ? (
                        <div className='all-user-find-card'>
                            {usuariosFiltrados?.[0] ?
                                usuariosFiltrados.map(usuario => (
                                    <Filtereduser key={usuario.id} thiIsTheCurrentUser={thiIsTheCurrentUser} usuario={usuario} filtro={filtro} />
                                )) :
                                <p className='noneUser'>No se encontró ninguna cuenta con ese nombre.</p>
                            }
                        </div>
                    ) : (
                        <div className='all-user-find-card'>
                            {Allusers.map(usuario => (
                                <Filtereduser key={usuario.id} thiIsTheCurrentUser={thiIsTheCurrentUser} usuario={usuario} filtro={filtro} />
                            ))}
                        </div>
                    )}
                </div>
                :
                <h2 className='all-user-noallowit'>Registrate <br /> o <br /> inicia sesión para buscar otros usuarios</h2>
            }
        </div>
    )
}

export default Allusers