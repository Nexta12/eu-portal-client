import React from 'react';
import { MobileNavbar, Navbar, NavbarBanner } from '@components/Navbar';
import { useCheckMobileScreen } from '@hooks/useCheckMobileScreen';
import styles from './Header.module.scss';

export const PageHeader = () => {
  const isMobile = useCheckMobileScreen();
  return (
    <div className={styles.headerContainer}>
      {isMobile ? (
        <MobileNavbar />
      ) : (
        <>
          <NavbarBanner />
          <Navbar />
        </>
      )}
    </div>
  );
};
