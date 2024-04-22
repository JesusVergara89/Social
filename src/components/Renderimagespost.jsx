import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/Renderimagespost.css'

const Renderimagespost = ({ id, images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToSlide = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className='Renderimagespost'>
            <div className="carousel">
                <Link to={`/singlepost/${id}`}>
                    <div className="slides">
                        {images.map((image, index) => (
                            <div key={index} className={index === currentImageIndex ? "slide active" : "slide"}>

                                <img src={image} alt={`Slide ${index}`} />

                            </div>
                        ))}
                    </div>
                </Link>
                <div className="buttons-container">
                    {images.map((_, index) => (
                        <button key={index} onClick={() => goToSlide(index)} className={index === currentImageIndex ? "active" : ""}>
                            <div className={index === currentImageIndex ? "circulo active": "circulo" }></div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Renderimagespost;
