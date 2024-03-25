import React from 'react'
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import '../style/Home.css'
import Post from './Post';
import Access from './Access';

const Home = () => {
  const [currentlyLoggedinUser] = useAuthState(auth);

  return (
    <article className="home">
      {currentlyLoggedinUser !== null ?
        <Post />
        :
        <Access />
      }
    </article>
  )
}

export default Home