import React from 'react';
import '../style/Displaysubcomment.css';

const Displaysubcomment = ({ comment }) => {
    const subcomments = Object.keys(comment.others).map(key => comment.others[key]);

    function formatCreatedAtDate(sub) {
        if (sub.createdAt && sub.createdAt.seconds) {
            const timestamp = sub.createdAt.seconds * 1000;
            const date = new Date(timestamp);
            return date.toDateString();
        }
        return '';
    }

    const hasSubcomments = subcomments.some(sub => sub.content);

    return (
        <div className="display-subcomment">
            {hasSubcomments && subcomments.map((sub, i) => (
                sub.content && (
                    <div className='display-subcomment-container' key={i}>
                        <h4 className='subcomment-comment'>{sub.content}</h4>
                        <h4 className='subcomment-date'>{sub.createdAt && formatCreatedAtDate(sub)}</h4>
                        <h4 className='subcomment-date'>{`@`}</h4>
                    </div>
                )
            ))}
        </div>
    );
};

export default Displaysubcomment;
