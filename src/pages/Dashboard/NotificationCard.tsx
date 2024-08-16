import React from 'react';
import { FcAbout, FcApproval, FcHighPriority, FcMediumPriority } from 'react-icons/fc';
import { Card } from 'antd';
import styles from './Dashboard.module.scss';

type NotificationLevel = 'info' | 'warning' | 'success' | 'error';

export type Notification = {
  title: string;
  message: string;
  level: NotificationLevel;
};

interface NotificationItemProps {
  heading: string;
  notifications: Notification[];
}

export const NotificationCard = ({ heading, notifications }: NotificationItemProps) => {
  const NotificationIcon = {
    info: FcAbout,
    warning: FcHighPriority,
    success: FcApproval,
    error: FcMediumPriority
  };

  return (
    <div>
      <Card className={styles.dashboardCard}>
        <div className="mb-1 font-large font-weight-bold">{heading}</div>
        <div>
          {notifications.map(({ title, message, level }, index) => {
            const Icon = NotificationIcon[level];
            return (
              <div className={styles.notificationItem} key={`${title}-${index}`}>
                <Icon size={30} />
                <div>
                  <div className="font-weight-bold">{title}</div>
                  <div className="text-color-secondary font-small">{message}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
