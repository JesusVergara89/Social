import './Countercomments.css'

const Countercomments = ({ thispost }) => {

    return (
        <div className="countercomments">
            <h5>{thispost.comments?.length - 1 >= 1 ? `${thispost.comments.length - 1}` : '0'}</h5>
            <i className='bx bx-message-rounded' />
        </div>
    )
}

export default Countercomments