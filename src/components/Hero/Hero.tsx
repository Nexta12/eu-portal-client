import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import LiveChat from '@components/LiveChat/LiveChat';
import { paths } from '@routes/paths';
import { AfricanLanguages, animations } from '@utils/data';
import styles from './Hero.module.scss';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    const changeMessage = () => {
      const randomMessageIndex = Math.floor(Math.random() * AfricanLanguages.length);
      const randomAnimationIndex = Math.floor(Math.random() * animations.length);
      setWelcomeMessage(AfricanLanguages[randomMessageIndex]);
      setAnimationClass(animations[randomAnimationIndex]);
    };

    changeMessage(); // Set an initial message
    const intervalId = setInterval(changeMessage, 10_000); // Update message every 60 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <div className={styles.heroContainer}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <div className={`${styles.title} ${styles[animationClass]}`}>{welcomeMessage}</div>
          <div className={styles.subtitle}>Everyone is qualified to learn</div>
          <Button
            type="primary"
            size="large"
            className="mt-2"
            onClick={() => navigate(paths.apply)}
          >
            Apply for Admission
          </Button>
        </div>
      </div>
      <LiveChat />
    </div>
  );
};
