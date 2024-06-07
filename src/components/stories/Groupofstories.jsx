import React, { useEffect, useState, useRef } from 'react';
import './Groupofstories.css';
import Deletestories from './Deletestories';

const Groupofstories = ({ story }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const changeStoryCount = useRef(0);
    const nonNullImages = story.filter(image => image !== null);
    const totalSlides = nonNullImages.length;

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
            const nextIndex = (prevIndex + 1) % totalSlides;
            return nextIndex;
        });
    };

    const goToPreviousSlide = () => {
        setCurrentImageIndex((prevIndex) => {
            const nextIndex = (prevIndex - 1 + totalSlides) % totalSlides;
            return nextIndex;
        });
    };

    const goToSlide = (index) => {
        setCurrentImageIndex(index);
    };

    useEffect(() => {
        if (totalSlides > 1) {
            const intervalId = setInterval(() => {
                setCurrentImageIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % totalSlides;
                    changeStoryCount.current += 1;
                    return nextIndex;
                });

                if (changeStoryCount.current >= totalSlides - 1) {
                    clearInterval(intervalId);
                }
            }, 8000);

            return () => clearInterval(intervalId);
        }
    }, [totalSlides]);

    return (
        <div className='group'>
            <div className='Post-render-img-group'>
                <div className="Renderimagespost-group" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <div className="slides-group">
                        {nonNullImages.map((stor, index) => (
                            <div key={index} className={index === currentImageIndex ? "slide active" : "slide"}>
                                <img src={stor.image} alt={`Slide ${index}`} />
                                <Deletestories stor={stor} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="buttons-container-group">
                {story.map((data, index) => {
                    if (data !== null) {
                        return (
                            <button style={{ width: `calc(100% / ${story.length})` }} key={index} onClick={() => goToSlide(index)} className={index === currentImageIndex ? "active" : ""}>
                                <div className={index === currentImageIndex ? "circulo-group active" : "circulo-group"}></div>
                            </button>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default Groupofstories;
