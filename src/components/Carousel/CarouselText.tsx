import React from 'react';
import { Button } from 'antd';
import styles from './CarouselText.module.scss';

interface CarouselTextProps {
  title: string;
  description: string;
  actionText: string;
}

const CarouselText = ({ title, description, actionText }: CarouselTextProps) => (
  <div className={styles.carouselTextContainer}>
    <h1 className={styles.title}>{title}</h1>
    <div className={styles.description}>{description}</div>
    <Button type="primary">{actionText}</Button>
  </div>
);

export default CarouselText;
