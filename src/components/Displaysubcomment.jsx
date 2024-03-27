import { useEffect, useState } from 'react'
import '../style/Displaysubcomment.css'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebaseConfig'

const Displaysubcomment = ({ comment }) => {

    const subcomments = Object.keys(comment.others).map(key => comment.others[key]);
     console.log(subcomments)
    return (
        <div className="display-subcomment">
            {subcomments &&
                subcomments.map((sub, i) => (
                    <div key={i}>
                        <h4>{sub.content}</h4>
                    </div>
                ))
            }
        </div>
    )
}

export default Displaysubcomment