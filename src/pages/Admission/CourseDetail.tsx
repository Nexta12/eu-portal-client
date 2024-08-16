import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { CourseStatsCard } from '@components/Card';
import { PageLayout } from '@components/Layout';
import { CardSkeleton } from '@components/Skeleton';
import { AntTag } from '@components/Tag';
import { monthsToYears } from '@utils/helpers';
import styles from './CourseDetail.module.scss';

type CourseDetailType = {
  name: string;
  overview: string;
  isCertificate: boolean;
  isDiploma: boolean;
  isDegree: boolean;
  isPostgraduate: boolean;
};

const initialValues: CourseDetailType = {
  name: '',
  overview: '',
  isCertificate: false,
  isDiploma: false,
  isDegree: false,
  isPostgraduate: false
};

const CourseDetail = () => {
  const params = useParams();
  const [fetchedProgramme, setFetchedProgramme] = useState<CourseDetailType>(initialValues);
  const { data: programme } = useSWR(
    `${endpoints.programmes}/${params.programmeId}`,
    async (url: string) => {
      const res = await apiClient.get(url);
      return res.data;
    }
  );

  useEffect(() => {
    if (programme) {
      setFetchedProgramme(programme);
    }
  }, [programme]);

  const renderCohort = (cohort: boolean, label: string) => (
    <div>{cohort && <AntTag text={label} color="red" />}</div>
  );

  return (
    <PageLayout className={styles.container} siteTitle="Course Details">
      <h1 className="font-weight-bolder">{fetchedProgramme?.name}</h1>
      <div className="d-flex mb-1 mt-1">
        {renderCohort(fetchedProgramme?.isCertificate, 'Certificate')}
        {renderCohort(fetchedProgramme?.isDiploma, 'Diploma')}
        {renderCohort(fetchedProgramme?.isDegree, 'Degree')}
        {renderCohort(fetchedProgramme?.isPostgraduate, 'PostGraduate')}
      </div>
      <div className={styles.pageContent}>
        <div className="lh-md pt-1">
          <div className="mt-2">
            {programme?.overview
              ? parse(programme?.overview)
              : 'Programme overview currently not available'}
            {!programme && <CardSkeleton number={1} />}
          </div>
        </div>
        <div>
          <CourseStatsCard durationInMonth={monthsToYears(programme?.durationInMonths)} />
        </div>
      </div>
    </PageLayout>
  );
};

export default CourseDetail;
