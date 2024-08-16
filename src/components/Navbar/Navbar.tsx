import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import cn from 'classnames';
import euaLogo from '@assets/images/eua-logo.png';
import { DropdownMenu } from '@components/Navbar/DropdownMenu';
import { NavItem } from '@customTypes/general';
import { useSticky } from '@hooks/index';
import { paths } from '@routes/paths';
import styles from './Navbar.module.scss';

export const ABOUT_MENU: NavItem[] = [
  {
    title: 'Our Vision and Mission',
    link: paths.vision
  },
  {
    title: 'Our Strategic Outlook and Values',
    link: paths.strategicOutlook
  },
  /* {
    title: 'Our Executive Team',
    link: '/executive-team'
  },
  {
    title: 'Our Collaborations and Partnerships',
    link: '/collaborations'
  }, */
  {
    title: 'Our History',
    link: paths.history
  }
];

export const ADMISSION_MENU = [
  {
    title: 'Admission Requirements and Guidelines',
    link: paths.admissionRequirements
  },
  {
    title: 'Faculties and Courses',
    link: paths.facultiesAndCourses
  },
  /* {
    title: 'Key Dates and Deadlines',
    link: '/key-dates'
  }, */
  {
    title: 'Fees',
    link: paths.fees
  },
  {
    title: 'Apply',
    link: paths.apply
  }
];

export const Navbar = () => {
  const { isSticky, stickyRef } = useSticky();
  const navigate = useNavigate();

  return (
    <div className={cn(styles.navbarContainer, { [styles.sticky]: isSticky })} ref={stickyRef}>
      <div className={isSticky ? styles.stickyNavItemsSection : styles.navItemsSection}>
        <img src={euaLogo} className={styles.logo} alt="eUniversity logo" />
        <div className={styles.navItems}>
          <DropdownMenu>
            <div onClick={() => navigate(paths.index)}>Home</div>
          </DropdownMenu>
          <DropdownMenu items={ABOUT_MENU}>
            <div>About eUA</div>
          </DropdownMenu>
          <DropdownMenu items={ADMISSION_MENU}>
            <div>Admission</div>
          </DropdownMenu>
          <DropdownMenu>
            <div onClick={() => navigate(paths.contactUs)}>Contact us</div>
          </DropdownMenu>
          <DropdownMenu>
            <div onClick={() => navigate(paths.blogs)}>Blogs</div>
          </DropdownMenu>
        </div>
      </div>
      <div className={styles.navActionButtons}>
        <Button type="primary" onClick={() => navigate(paths.login)}>
          LOGIN
        </Button>
        <Button type="primary" ghost className={styles.ghost} onClick={() => navigate(paths.apply)}>
          APPLY
        </Button>
      </div>
    </div>
  );
};
