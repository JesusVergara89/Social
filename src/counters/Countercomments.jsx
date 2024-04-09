import './Countercomments.css'

const Countercomments = ({ thispost }) => {
        
    return (
        <div className="countercomments">
            <h5>{thispost.comments?.length - 1 >= 1 ? `${thispost.comments.length - 1} Comments`: '0 Coments'}</h5>
        </div>
    )
}

export default Countercomments