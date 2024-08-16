import React from 'react';
import { BsClipboardCheck } from 'react-icons/bs';
import { Button, Card, Progress } from 'antd';
import styles from '@pages/Dashboard/Dashboard.module.scss';
import { colorPrimary } from '@styles/theme';

export type AcademicCourse = {
  title: string;
  days?: number;
  progressPercent?: number;
  type: 'class' | 'test' | 'assignment';
};

interface AcademicsCardProps {
  heading: string;
  courses?: AcademicCourse[];
}

export const AcademicsCard = ({ heading, courses }: AcademicsCardProps) => {
  const buttonText = {
    class: 'Take Class',
    test: 'Take Test',
    assignment: 'Do Assignment'
  };

  return (
    <div className={styles.academicWrapper}>
      <h2>{heading}</h2>
      <Card className={styles.dashboardCard}>
        {courses?.map(({ title, type, days, progressPercent }, index) => (
          <div className={styles.academicsItem} key={`${title}${index}`}>
            <div className="d-flex align-items-center gap-1">
              {type === 'class' ? (
                <Progress
                  type="circle"
                  percent={progressPercent}
                  size="small"
                  strokeColor={colorPrimary}
                />
              ) : (
                <BsClipboardCheck size={60} color={colorPrimary} />
              )}

              <div>
                <div>{title}</div>
                <div className="font-small">
                  {type === 'class' ? 'Last opened' : 'Days left'}: {days} days ago
                </div>
              </div>
            </div>
            <Button>{buttonText[type]}</Button>
          </div>
        ))}
      </Card>
    </div>
  );
};
