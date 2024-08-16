import React from 'react';
import { Card } from 'antd';
import { formatNaira } from '@utils/currencyFormatter';
import { capitalize } from '@utils/letterFormatter';
import styles from './Profile.module.scss';

interface ProfileCardProps {
  image?: string;
  cohort?: string;
  matricNumber?: string;
  course?: string;
  balance?: number;
}

const none = <p className="text-color-error">none</p>;

export const ProfileCard = ({
  image,
  cohort,
  matricNumber,
  course,
  balance = 0
}: ProfileCardProps) => (
  <Card>
    <div className="d-flex justify-content-center">
      {image && <img src={image} alt="user" className={styles.img} />}
    </div>
    <div className="my-3">
      <div className={styles.cardStudentData}>
        <div className="text-color-secondary">Cohort</div>
        <div>{cohort ? capitalize(cohort) : none}</div>
      </div>
      <div className={styles.cardStudentData}>
        <div className="text-color-secondary">Matric Number</div>
        <div>{matricNumber || none}</div>
      </div>
      <div className={styles.cardStudentData}>
        <div className="text-color-secondary">Balance</div>
        <div>{formatNaira.format(balance)}</div>
      </div>
    </div>
    <div className={styles.profileCardFooter}>
      <div>{course ? capitalize(course) : none}</div>
    </div>
  </Card>
);
