import React, { useEffect, useState } from 'react'
import './Groupofstories.css'
import Deletestories from './Deletestories';

const Groupofstories = ({ story }) => {

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nonNullImages = story.filter(image => image !== null);

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

    const changeStory = () => {
        setTimeout(() => {
            goToNextSlide()
        }, 8000);
    }

    useEffect(()=>{
        changeStory()
    },[])
   

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
                {story.map((data, index, array) => {
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
    )
}

export default Groupofstories