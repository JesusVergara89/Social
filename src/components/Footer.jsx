import React from 'react'
import '../style/Footer.css'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-container-description-page">
          <p>
            Explore Ecosocial: your eco-friendly social hub. <a href="https://github.com/JesusVergara89/Social" target="_blank"> Join our open-source platform.</a>
          </p>
        </div>
        <div className="footer-container-create-post">
          <Link to={'/createpost'}>
            <div className="footer-menu">
              <i className='bx bxs-plus-square'></i>
              <h5>New post</h5>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer