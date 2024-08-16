import React from 'react';
import { BiBookAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import { AntTag } from '@components/Tag';
import { paths } from '@routes/paths';
import styles from './CourseSummaryCard.module.scss';

interface CourseSummaryCardProps {
  programmeId: string;
  title: string;
  description: string;
  duration: string | number;
  degree: boolean;
  certificate: boolean;
  diploma: boolean;
  postgraduate: boolean;
}

export const CourseSummaryCard = ({
  programmeId,
  title,
  duration,
  description,
  degree,
  certificate,
  diploma,
  postgraduate
}: CourseSummaryCardProps) => {
  const navigate = useNavigate();
  const courseTitle = (
    <div className={styles.courseTitle}>
      <BiBookAlt size={24} />
      <div>{title}</div>
    </div>
  );

  const renderCohort = (cohort: boolean, label: string) => (
    <div>{cohort && <AntTag text={label} color="red" />}</div>
  );

  return (
    <Card
      title={courseTitle}
      className={styles.courseCard}
      actions={[
        <div className={styles.actionLink}>
          <span onClick={() => navigate(`${paths.courseDetails}/${programmeId}`)}>
            View details
          </span>
        </div>
      ]}
    >
      <div className={styles.courseBody}>
        <div>
          <div className="d-flex mb-2">
            {renderCohort(certificate, 'Certificate')}
            {renderCohort(diploma, 'Diploma')}
            {renderCohort(degree, 'Degree')}
            {renderCohort(postgraduate, 'PostGraduate')}
          </div>
          <div className="lh-md font-normal">{description}</div>
          <div className="mt-2 fw-bolder font-normal">Duration: {duration} months</div>
        </div>
      </div>
    </Card>
  );
};
