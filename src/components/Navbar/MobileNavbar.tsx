import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { MobileNav } from '@components/Navbar/MobileNav';
import styles from './MobileNavbar.module.scss';

export const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className={styles.mobileNavContainer}>
        <div className={styles.title} onClick={() => navigate('/')}>
          eUniversity Africa
        </div>
        <div>
          {isOpen ? (
            <AiOutlineClose size={40} cursor="pointer" onClick={handleMenuToggle} />
          ) : (
            <AiOutlineMenu size={40} cursor="pointer" onClick={handleMenuToggle} />
          )}
        </div>
      </div>
      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};
