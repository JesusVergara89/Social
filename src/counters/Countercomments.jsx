import './Countercomments.css'

const Countercomments = ({ thispost }) => {
    return (
        <div className="countercomments">
            <i className='bx bx-message-rounded' />
            <h6>{thispost.comments?.length - 1 >= 1 ? `${thispost.comments.length - 1}` : '0'}</h6>
        </div>
    )
}

export default Countercomments