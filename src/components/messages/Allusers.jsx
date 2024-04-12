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
            usuario.userName.toLowerCase().includes(valor) || usuario.name.toLowerCase().includes(valor)
        );
        setUsuariosFiltrados(resultados);
    };
    //console.log(Allusers)
    return (
        <div className='all-users'>
            <p>Encuentra conexiones por nombre o usuario</p>
            <div className="all-user-find">
                <input
                    id='inputfind'
                    type="text"
                    value={filtro}
                    onChange={handleInputChange}
                    placeholder="Buscar usuario..."
                />
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
        </div>
    )
}

export default Allusers