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
    console.log(thiIsTheCurrentUser.uid)
    console.log(Allusers)
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

                    {filtro && usuariosFiltrados.length > 0 && (
                        <div className='all-user-find-card'>
                            {usuariosFiltrados.map(usuario => (
                                <div key={usuario.id}>
                                    <Filtereduser thiIsTheCurrentUser={thiIsTheCurrentUser} usuario={usuario} />
                                </div>
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