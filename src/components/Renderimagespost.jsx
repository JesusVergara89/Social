import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/Renderimagespost.css';

const Renderimagespost = ({ id, images }) => {
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nonNullImages = images.filter(image => image !== null);

    let touchStartX = 0;

    const handleTouchStart = (e) => {
        touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const delta = touchEndX - touchStartX;
        const threshold = 30;
        if (delta > threshold) {
            goToPreviousSlide();
        } else if (delta < -threshold) {
            goToNextSlide();
        }
    };

    const goToNextSlide = () => {
        setCurrentImageIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % nonNullImages.length;
            return nextIndex;
        });
    };

    const goToPreviousSlide = () => {
        setCurrentImageIndex((prevIndex) => {
            const nextIndex = (prevIndex - 1 + nonNullImages.length) % nonNullImages.length;
            return nextIndex;
        });
    };

    const goToSlide = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className='Post-render-img'>
            <div className="Renderimagespost" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <Link to={`/singlepost/${id}`}>
                    <div className="slides">
                        {nonNullImages.map((image, index) => (
                            <div key={index} className={index === currentImageIndex ? "slide active" : "slide"}>
                                <img src={image} alt={`Slide ${index}`} />
                            </div>
                        ))}
                    </div>
                </Link>
            </div>
            <div className="buttons-container">
                {images.map((data, index) => {
                    if (data !== null) {
                        return (
                            <button key={index} onClick={() => goToSlide(index)} className={index === currentImageIndex ? "active" : ""}>
                                <div className={index === currentImageIndex ? "circulo active" : "circulo"}></div>
                            </button>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default Renderimagespost;
