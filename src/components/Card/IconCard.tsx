import React, { ReactNode } from 'react';
import { FaDesktop } from 'react-icons/fa';
import styles from './IconCard.module.scss';

interface IconCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon?: ReactNode;
}

export const IconCard = ({ title, subtitle, description, icon }: IconCardProps) => (
  <div className={styles.iconCardContainer}>
    {icon || <FaDesktop className={styles.icon} />}
    <h2 className={styles.title}>{title}</h2>
    <div className={styles.subtitle}>{subtitle}</div>
    <p className={styles.description}>{description}</p>
  </div>
);
