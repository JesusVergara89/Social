    import { useEffect, useState } from "react";
    import { db } from "../firebaseConfig";
    import { toast } from 'react-toastify';
    import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";

    const Comment = ({ postId }) => {
        const [mainComment, setMainComment] = useState('');
        const [othersComment, setOthersComment] = useState('');
        const [post, setPost] = useState(null);
        const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar la carga inicial

        useEffect(() => {
            const fetchData = async () => {
                try {
                    if (postId) {
                        const docRef = doc(db, 'Post', postId);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            setPost({ ...docSnap.data(), id: docSnap.id });
                            setIsLoading(false); // Establecer isLoading a false cuando los datos se han cargado correctamente
                        } else {
                            setPost(null);
                        }
                    }
                } catch (error) {
                    toast.error(error.message);
                }
            };

            if (postId && isLoading) { // Agregar la condición isLoading para evitar la recarga de datos si isLoading es falso
                fetchData();
            }
        }, [postId, isLoading]); // Agregar isLoading a las dependencias de useEffect

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const postRef = doc(db, 'Post', post.id);
                let updatedComments = [];

                // Verificar si el comentario principal está lleno
                if (post.comments[0].main) {
                    // Si el comentario principal ya está lleno, creamos un nuevo objeto de comentarios similar al primero
                    updatedComments = [
                        {
                            ...post.comments[0], // Copiamos el primer objeto de comentarios
                            createdAt: Timestamp.now().toDate(), // Actualizamos la fecha de creación
                            main: mainComment, // Agregamos el nuevo comentario en el main
                        },
                        ...post.comments, // Agregamos los comentarios existentes después del nuevo comentario
                    ];
                } else {
                    // Si el comentario principal está vacío, simplemente actualizamos el primer comentario
                    updatedComments = [{
                        createdAt: Timestamp.now().toDate(),
                        main: mainComment,
                        others: {
                            one: { content: '', createdAt: null },
                            two: { content: '', createdAt: null },
                            three: { content: '', createdAt: null },
                            four: { content: '', createdAt: null },
                        }
                    }, ...post.comments];
                }

                await setDoc(postRef, {
                    ...post,
                    comments: updatedComments
                });

                toast.success('Comment added successfully');
                setMainComment(''); // Limpiar el comentario principal después de enviarlo
            } catch (error) {
                console.error('Error adding comment:', error);
                toast.error('Failed to add comment');
            }
        };

        const handleSubmitOthers = async (e) => {
            e.preventDefault();
            try {
                const postRef = doc(db, 'Post', post.id);

                // Verificar si el comentario principal existe antes de agregar comentarios secundarios
                if (post.comments[0].main) {
                    const updatedComments = [
                        {
                            ...post.comments[0], // Copiar el primer objeto de comentarios
                            others: {
                                ...post.comments[0].others, // Copiar los comentarios secundarios existentes
                                [getNextAvailableComment(post.comments[0].others)]: { // Agregar el nuevo comentario secundario
                                    content: othersComment,
                                    createdAt: Timestamp.now().toDate()
                                }
                            }
                        },
                        ...post.comments.slice(1) // Mantener los comentarios existentes después del primer comentario
                    ];

                    await setDoc(postRef, {
                        ...post,
                        comments: updatedComments
                    });

                    toast.success('Additional comment added successfully');
                    setOthersComment(''); // Limpiar el comentario secundario después de enviarlo
                } else {
                    toast.error('Main comment does not exist'); // Mostrar un mensaje de error si no hay un comentario principal
                }
            } catch (error) {
                console.error('Error adding additional comment:', error);
                toast.error('Failed to add additional comment');
            }
        };

        // Función para obtener el siguiente comentario secundario disponible
        const getNextAvailableComment = (others) => {
            const availableComments = ['one', 'two', 'three', 'four'];
            for (const comment of availableComments) {
                if (!others[comment].content) {
                    return comment;
                }
            }
            return null; // Devolver null si no hay comentarios disponibles
        };

        return (
            <div className="comments">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className='main-comment'
                        placeholder="Main Comment"
                        value={mainComment}
                        onChange={(e) => setMainComment(e.target.value)}
                    />
                    <button type="submit">Add Comment</button>
                </form>
                <form onSubmit={handleSubmitOthers}>
                    <input
                        type="text"
                        className='others-comment'
                        placeholder="Others Comment"
                        value={othersComment}
                        onChange={(e) => setOthersComment(e.target.value)}
                    />
                    <button type="submit">Add Comment</button>
                </form>
            </div>
        );
    }

    export default Comment;
