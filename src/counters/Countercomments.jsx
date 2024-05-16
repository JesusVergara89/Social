import './Countercomments.css';

const Countercomments = ({ thispost }) => {

    return (
        <div className="countercomments">
            <i className="bx bx-message-rounded-dots"></i>
            <h6>{thispost.comments.length - 1 === 0 ? '' : thispost.comments.length - 1}</h6>
        </div>
    );
};

export default Countercomments;
