import React from 'react';
import { IconType } from 'react-icons';
import { Card } from 'antd';
import styles from './Dashboard.module.scss';

interface StatisticsCardProps {
  title: string;
  Icon: IconType;
  value: string;
  description: string;
}

export const StatisticsCard = ({ title, Icon, value, description }: StatisticsCardProps) => (
  <Card className={styles.statisticsCard}>
    <div className="d-flex gap-2 mb-1 justify-content-center">
      <Icon className={styles.icon} size={30} />
      <div>{title}</div>
    </div>
    <div>
      <h1 className="font-weight-bolder">{value}</h1>
      <div className="font-small mt-n2">{description}</div>
    </div>
  </Card>
);
