import React, { useState } from 'react';
import { BiSolidChevronDown } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, MenuProps } from 'antd';
import cn from 'classnames';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import UserAvatar from '@components/Header/UserAvatar';
import { SuccessResponse } from '@customTypes/general';
import { StudentProfile, UserRole } from '@customTypes/user';
import { getUserType } from '@pages/Dashboard/Dashboard';
import { paths } from '@routes/paths';
import useAuthStore from '@store/authStore';
import { UserIntroSection, UserIntroSectionMini } from './AvatarIntroSection';
import styles from './Header.module.scss';

const LogoutButton = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(paths.login);
  };

  return <div onClick={handleLogout}>Logout</div>;
};

const userItems: MenuProps['items'] = [
  {
    label: <UserIntroSection />,
    key: '1',
    className: styles.userIntroSection
  },
  {
    type: 'divider'
  },
  {
    label: 'Profile',
    key: '2',
    className: styles.dropdownItem
  },
  {
    label: <LogoutButton />,
    key: '3',
    className: styles.dropdownItem
  }
];

const applicationItems: MenuProps['items'] = [
  {
    label: <UserIntroSectionMini />,
    key: '1',
    className: styles.userIntroSection
  },
  {
    type: 'divider'
  },
  {
    label: <LogoutButton />,
    key: '3',
    className: styles.dropdownItem
  }
];

const UserInfo = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const userId = user?.userId;
  const profileUrl =
    user?.role === UserRole.student
      ? `${endpoints.students}/${userId}`
      : `${endpoints.staffs}/${userId}`;

  const { data: profile } = useSWR(profileUrl, async (url: string) => {
    const response = await apiClient.get<SuccessResponse<StudentProfile>>(url);
    return response.data.data;
  });

  const type = user ? getUserType(user) : 'user';

  const getDropdownItems = {
    application: applicationItems,
    user: userItems,
    staff: applicationItems
  };

  return (
    <Dropdown
      menu={{ items: getDropdownItems[type] }}
      overlayClassName={styles.dropdown}
      trigger={['click']}
      onOpenChange={() => setOpen(!open)}
    >
      <Button size="large" className={styles.avatarButton}>
        {profile?.document?.picture ? (
          <img
            src={profile?.document?.picture}
            alt={profile?.firstName}
            className={styles.userPicture}
          />
        ) : (
          <UserAvatar userName={user?.firstName || ''} />
        )}
        <BiSolidChevronDown className={cn(styles.chevron, { [styles.open]: open })} />
      </Button>
    </Dropdown>
  );
};

export default UserInfo;
