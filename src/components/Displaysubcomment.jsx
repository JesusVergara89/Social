import '../style/Displaysubcomment.css';

const Displaysubcomment = ({ comment,users }) => {

    const subcomments = Object.keys(comment.others).map(key => comment.others[key]);

    const formatCreatedAtDate = (sub) => {
        if (sub.createdAt && sub.createdAt.seconds) {
            const timestamp = sub.createdAt.seconds * 1000;
            const date = new Date(timestamp);
            return date.toDateString();
        }
        return '';
    }

    const subcommentsFormatted = subcomments.map(sub => ({
        ...sub,
        createdAt: formatCreatedAtDate(sub)
    }));

    const getUserNames = (subcomments, users) => {
        const userNames = [];
    
        subcomments.forEach(subcomment => {
            const matchedUser = users.find(user => user.idUser === subcomment.userID);
            if (matchedUser) {
                userNames.push(matchedUser.userName);
            }
        });
    
        return userNames;
    }

    let arrayNames = getUserNames(subcomments, users)

    return (
        <div className="display-subcomment">
            {subcommentsFormatted && subcommentsFormatted.map((sub, i) => (
                sub.content && (
                    <div className='display-subcomment-container' key={i}>
                        <h4 className='subcomment-comment'>{sub.content}</h4>
                        <h4 className='subcomment-date'>{sub.createdAt}</h4>
                        <h4 className='subcomment-date'>{`@${arrayNames[i]}`}</h4>
                    </div>
                )
            ))}
        </div>
    );
};

export default Displaysubcomment;
