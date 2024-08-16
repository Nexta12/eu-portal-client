/* eslint-disable react/no-unstable-nested-components */
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Button, Collapse } from 'antd';
import { ABOUT_MENU, ADMISSION_MENU } from '@components/Navbar/Navbar';
import { NavItem } from '@customTypes/general';
import { paths } from '@routes/paths';
import styles from './MobileNav.module.scss';

const { Panel } = Collapse;

interface MobileNavItemProps {
  itemId: string;
  title: string;
  items?: NavItem[];
  navLink?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const mobileNavItems = [
  {
    itemId: '1',
    title: 'About eUA',
    items: ABOUT_MENU
  },
  {
    itemId: '2',
    title: 'Admission',
    items: ADMISSION_MENU
  },
  {
    itemId: '3',
    title: 'Contact Us',
    navLink: paths.contactUs
  },
  {
    itemId: '4',
    title: 'Blogs',
    navLink: paths.blogs
  }
];

const MobileNavItem = ({ title, items, itemId, setIsOpen, navLink = '' }: MobileNavItemProps) => {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  const handleActive = () => {
    setActive(!active);
  };

  const handleNavigation = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };

  return items && items.length > 0 ? (
    <Collapse
      expandIcon={({ isActive }) =>
        isActive ? <AiOutlineMinus size={25} /> : <AiOutlinePlus size={25} />
      }
      expandIconPosition="end"
      onChange={handleActive}
    >
      <Panel header={title} key={itemId} className={active && styles.activePanel}>
        {items.map(({ title: navTitle, link }, index) => (
          <div
            className={styles.navItem}
            key={`${navTitle}${index}`}
            onClick={() => handleNavigation(link)}
          >
            {navTitle}
          </div>
        ))}
      </Panel>
    </Collapse>
  ) : (
    <div onClick={() => handleNavigation(navLink)}>{title}</div>
  );
};

export const MobileNav = ({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const handleLogin = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <div className={styles.mobileMenu}>
          <div>
            <div className={styles.callNumber}>+234 (0)8903948374</div>
            <div className={styles.actionButtons}>
              <Button type="primary" onClick={() => handleLogin(paths.login)}>
                LOGIN
              </Button>
              <Button type="primary" ghost onClick={() => handleLogin(paths.apply)}>
                APPLY
              </Button>
            </div>
          </div>
          <div className={styles.mobileNavItem}>
            {mobileNavItems.map(({ title, items, itemId, navLink }) => (
              <MobileNavItem
                key={itemId}
                title={title}
                itemId={itemId}
                items={items}
                navLink={navLink}
                setIsOpen={setIsOpen}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
