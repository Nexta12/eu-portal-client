import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, MenuProps } from 'antd';
import { NavItem } from '@customTypes/general';
import styles from './DropdownMenu.module.scss';

interface DropdownMenuProps {
  items?: NavItem[];
  children: ReactNode;
}

export const DropdownMenu = ({ items, children }: DropdownMenuProps) => {
  const navigate = useNavigate();
  const handleNavigation = (url: string) => navigate(url);

  const menuItems: MenuProps['items'] = items?.map(({ title, link }, index) => ({
    key: `${title}${index}`,
    label: <div className={styles.menuItemLabel}>{title}</div>,
    className: styles.menuItem,
    onClick: () => handleNavigation(link)
  }));

  return items ? (
    <Dropdown
      overlayClassName={styles.dropdownOverlay}
      menu={{ items: menuItems }}
      placement="bottomLeft"
      className="cursor-pointer"
    >
      {children}
    </Dropdown>
  ) : (
    <div className="cursor-pointer">{children}</div>
  );
};
