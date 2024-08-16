import React from 'react';
import { Avatar } from 'antd';
import styles from './Header.module.scss';

const UserAvatar = ({ userName }: { userName: string }) => (
  <Avatar className={styles.userAvatar} size="large" gap={4}>
    {userName.slice(0, 1)}
  </Avatar>
);

export default UserAvatar;
