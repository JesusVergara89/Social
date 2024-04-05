import React from 'react'
import './Displaycounters.css'
import Friendcounter from './Friendcounter'
import { useSelector } from 'react-redux'

const Displaycounters = () => {

  const postNumbers = useSelector(state => state.postNumber)

  return (
    <div className="displaycounters">
      <Friendcounter />
      <div className='Friendcounter'>
        <div className="Friendcounter-number">
          <h4><span>{postNumbers}</span></h4>
        </div>
        <div className="Friendcounter-connections">
          <h4>{postNumbers > 1 ? `publicaciones` : `publicación`}</h4>
        </div>
      </div>
    </div>
  )
}

export default Displaycounters