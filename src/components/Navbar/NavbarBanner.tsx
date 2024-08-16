import React from 'react';
import { Link } from 'react-router-dom';
import euaLogo from '@assets/images/eua-logo.png';
import styles from './NavbarBanner.module.scss';

export interface NavbarBannerProps {
  title?: string;
}

export const NavbarBanner = ({ title = 'eUniversity Africa' }: NavbarBannerProps) => (
  <div className={styles.bannerContainer}>
    <div className={styles.title}>
      <Link to="/">
        <img src={euaLogo} alt="eUniversity logo" />
      </Link>
      <div>{title}</div>
    </div>
    <div>
      Call{' '}
      <a href="tel:+234 803 588 5539" className={styles.phoneNumber}>
        +234 803 588 5539
      </a>
    </div>
  </div>
);
