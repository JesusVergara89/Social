import '../style/Postuserinfo.css'
import { useNavigate } from 'react-router-dom'
const Postuserinfo = ({ p, IdAndUserName }) => {
   
    const navigate = useNavigate()

    const returnCorrectID = IdAndUserName?.filter(data => {
        if(data.userName === p.userName){
            return data
        }
    })

    return (
        <div className="post-card-userinfo">
            <div onClick={() => {navigate(`/singleprofile/${returnCorrectID[0].id}`)}} className="post-card-userinfo-1">
                <img src={p.userPhoto} alt="" />
                <h6>{`@${p.userName}`}</h6>
            </div>
            <div className="post-card-userinfo-2">
                <h6>{p.createdAt.toDate().toDateString()}</h6>
            </div>
        </div>
    )
}

export default Postuserinfo