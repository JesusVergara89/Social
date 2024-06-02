import React, { useState } from 'react'
import './Groupofstories.css'

const Groupofstories = ({ images }) => {

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

    return (
        <div className='group'>
           <div className='Post-render-img'>
            <div className="Renderimagespost" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <div className="slides">
                        {nonNullImages.map((image, index) => (
                            <div key={index} className={index === currentImageIndex ? "slide active" : "slide"}>
                                <img src={image.image} alt={`Slide ${index}`} />
                            </div>
                        ))}
                    </div>
            </div>
        </div>
        </div>
    )
}

export default Groupofstories