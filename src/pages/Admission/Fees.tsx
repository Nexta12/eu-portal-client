/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FeesCard } from '@components/Card';
import { PageLayout } from '@components/Layout';
import { Cohort } from '@customTypes/user';
import { paths } from '@routes/paths';
import styles from './Fees.module.scss';

const programmeFees = [
  {
    cohort: Cohort.CERTIFICATE,
    subtitle: 'Total amount payable for this Certificate',
    feesList: [
      { name: 'Application Fee', value: 100 },
      { name: 'Tuition Fee', value: 900 },
      { name: 'Library', value: 40 },
      { name: 'Student Council', value: 120 }
    ]
  },
  {
    cohort: Cohort.DIPLOMA,
    subtitle: 'Total amount of money payable for this Diploma',
    feesList: [
      { name: 'Application Fee', value: 100 },
      { name: 'Tuition Fee', value: 1100 },
      { name: 'Library', value: 50 },
      { name: 'Student Council', value: 120 }
    ]
  },
  {
    cohort: Cohort.DEGREE,
    subtitle: 'Total amount of money payable for this Degree',
    feesList: [
      { name: 'Application Fee', value: 100 },
      { name: 'Tuition Fee', value: 1300 },
      { name: 'Library', value: 60 },
      { name: 'Student Council', value: 120 }
    ]
  }
];

const Fees = () => {
  const navigate = useNavigate();

  return (
    <PageLayout siteTitle="Fees and Tuition">
      <div className="mb-3">
        <h1>Fees and Tuition</h1>
        <p>Required amount to be paid based</p>
      </div>
      <div className={styles.feesCardContainer}>
        {programmeFees.map(({ cohort, subtitle, feesList }) => (
          <FeesCard
            cohort={cohort}
            subtitle={subtitle}
            feesList={feesList}
            key={cohort}
            onClick={() => navigate(paths.apply)}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default Fees;
