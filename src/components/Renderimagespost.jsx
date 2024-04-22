import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Renderimagespost = ({ id, images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToSlide = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className='Renderimagespost'>
            <div className="carousel">
                <div className="slides">
                    {images.map((image, index) => (
                        <div key={index} className={index === currentImageIndex ? "slide active" : "slide"}>
                            <Link to={`/singlepost/${id}`}>
                                <img src={image} alt={`Slide ${index}`} />
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="buttons-container">
                    {images.map((_, index) => (
                        <button key={index} onClick={() => goToSlide(index)} className={index === currentImageIndex ? "active" : ""}>
                            <div className="circulo"></div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Renderimagespost;
