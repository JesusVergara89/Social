import '../style/Displaysubcomment.css';
import DeleteSubcomments from './DeleteSubcomments';

const Displaysubcomment = ({ comment, users, index, post }) => {

    const subcomments = Object.keys(comment.others).map(key => comment.others[key]);

    const getUserNames = (subcomments, users) => {
        subcomments.forEach(subcomment => {
            const matchedUser = users.find(user => user.idUser === subcomment.userID);
            if (matchedUser) {
                subcomment.userName = matchedUser.userName;
            } else {
                subcomment.userName = '';
            }
        });

        return subcomments;
    };

    let arrayNames = getUserNames(subcomments, users)

    const formatCreatedAtDate = (sub) => {
        if (sub.createdAt && sub.createdAt.seconds) {
            const timestamp = sub.createdAt.seconds * 1000;
            const date = new Date(timestamp);
            return date.toDateString();
        }
        return '';
    }

    const subcommentsFormatted = arrayNames.map(sub => ({
        ...sub,
        createdAt: formatCreatedAtDate(sub)
    }));
    //console.log(subcommentsFormatted)
    return (
        <div className="display-subcomment">
            {subcommentsFormatted && subcommentsFormatted.map((sub, i) => (
                sub.content && sub.createdAt && (
                    <div className='display-subcomment-container' key={i}>
                        <DeleteSubcomments post={post} subcommentsFormatted={subcommentsFormatted}  indexSub={i} />
                        <h4 className='subcomment-comment'>{sub.content}</h4>
                        <h4 className='subcomment-date'>{sub.createdAt}</h4>
                        <h4 className='subcomment-date'>{`@${sub.userName}`}</h4>
                    </div>
                )
            ))}
        </div>
    );
};

export default Displaysubcomment;
