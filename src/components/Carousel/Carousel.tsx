import React, { useCallback, useEffect } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import industrialView from '@assets/industryview.jpg';
import riverboat from '@assets/riverboat.jpg';
import toesocks from '@assets/toesocks.jpg';
import CarouselText from '@components/Carousel/CarouselText';
import styles from './Carousel.module.scss';

const slides = [
  {
    url: industrialView,
    text: {
      title: 'Industrial View',
      description: 'This is a description of the industrial view',
      actionText: 'View More'
    }
  },
  {
    url: riverboat,
    text: {
      title: 'Riverboat',
      description: 'This is a description of the riverboat',
      actionText: 'View More'
    }
  },
  {
    url: toesocks,
    text: {
      title: 'Toesocks',
      description: 'This is a description of the toesocks',
      actionText: 'View More'
    }
  }
];

const SLIDER_INTERVAL = 500_000;

export const Carousel = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(goToNext, SLIDER_INTERVAL);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div className={styles.carousel}>
      <div className={styles.leftArrow} onClick={goToPrevious}>
        <AiOutlineLeft />
      </div>
      <div className={styles.rightArrow} onClick={goToNext}>
        <AiOutlineRight />
      </div>
      <div
        className={styles.carouselItem}
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
      >
        <CarouselText {...slides[currentIndex].text} />
      </div>
      <div className={styles.dotContainer}>
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            className={currentIndex === slideIndex ? styles.activeDot : styles.inactiveDot}
            onClick={() => goToSlide(slideIndex)}
          >
            &#11044;
          </div>
        ))}
      </div>
    </div>
  );
};
