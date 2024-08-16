import React from 'react';
import { Cohort } from '@customTypes/user';
import { formatUSDollar } from '@utils/currencyFormatter';
import styles from './FeesCard.module.scss';

interface FeesCardProps {
  cohort: Cohort;
  subtitle: string;
  feesList: { name: string; value: number }[];
  onClick?: () => void;
}

export const FeesCard = ({ cohort, subtitle, feesList, onClick }: FeesCardProps) => (
  <div className={styles.cardContainer} onClick={onClick}>
    <h3>{cohort}</h3>
    <h1>{formatUSDollar.format(feesList.reduce((acc, fee) => acc + fee.value, 0))}</h1>
    <div>{subtitle}</div>
    <div className="mt-4">
      {feesList.map(({ name, value }, index) => (
        <div className={styles.feeLine} key={`${name}${index}`}>
          <div>{name}</div>
          <div>{formatUSDollar.format(value)}</div>
        </div>
      ))}
    </div>
  </div>
);
