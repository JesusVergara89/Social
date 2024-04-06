import useInvisible from '../hooks/useInvisible';

const Invisiblecomp = () => {

    const { friends } = useInvisible()

    console.log(friends.length * Math.random());
    
    return (
        <div style={{ position: 'absolute', top: '-550px' }}>Invisiblecomp</div>
    );
};

export default Invisiblecomp;
