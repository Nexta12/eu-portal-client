import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'antd';
import { paths } from '@routes/paths';
import styles from './CourseStatsCard.module.scss';

interface CourseStatsCardProps {
  durationInMonth: string | number;
}

export const CourseStatsCard = ({ durationInMonth }: CourseStatsCardProps) => {
  const navigate = useNavigate();
  return (
    <Card title="Quick Stats" className={styles.card}>
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div>{durationInMonth}</div>
          <div>Estimated Time</div>
        </div>
        <div className={styles.stat}>
          <div>40 Credits</div>
          <div>Total Credits</div>
        </div>
      </div>
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div>45000</div>
          <div>Cost</div>
        </div>
        <div className={styles.stat}>
          <div>Online</div>
          <div>Format</div>
        </div>
      </div>
      <Button
        type="primary"
        size="large"
        block
        className="mt-1"
        onClick={() => navigate(paths.apply)}
      >
        Apply
      </Button>
    </Card>
  );
};
