import './Countercomments.css';

const Countercomments = ({ thispost }) => {
    return (
        <div className="countercomments">
            {thispost.comments && thispost.comments.length > 1 ? (
                <div className='countercomments-inner'>
                    {thispost.comments.length - 1}{' '}
                    <i className="bx bx-message-rounded-dots"></i>
                </div>
            ) : (
                <div className='countercomments-inner'>
                    0 <i className="bx bx-message-rounded-dots"></i>
                </div>
            )}
        </div>
    );
};

export default Countercomments;
