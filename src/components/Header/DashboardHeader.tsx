import React, { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaBars } from 'react-icons/fa';
import { Button } from 'antd';
import euaLogo from '@assets/images/eua-logo.png';
import UserInfo from '@components/Header/UserInfo';
import styles from './Header.module.scss';

type HeaderProps = {
  showSidebar: boolean;
  setShowSidebar: (data: boolean) => void;
};
export const DashboardHeader = ({ showSidebar, setShowSidebar }: HeaderProps) => {
  useEffect(() => {
    document.body.style.overflow = showSidebar ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSidebar]);

  return (
    <div className={styles.dashboardHeaderContainer}>
      <img src={euaLogo} alt="eUniversity logo" className={styles.logo} />
      <div className={styles.dashboardHeaderInfo}>
        <UserInfo />
        {showSidebar ? (
          <Button onClick={() => setShowSidebar(!showSidebar)} className={styles.icon}>
            <AiOutlineClose size={25} />
          </Button>
        ) : (
          <Button onClick={() => setShowSidebar(!showSidebar)} className={styles.icon}>
            <FaBars size={25} />
          </Button>
        )}
      </div>
    </div>
  );
};
