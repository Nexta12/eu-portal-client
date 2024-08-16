import React from 'react';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { CourseSummaryCard } from '@components/Course';
import { PageLayout } from '@components/Layout';
import { CardSkeleton } from '@components/Skeleton';
import { Programme } from '@customTypes/courses';
import styles from './CoursesFaculties.module.scss';

const CoursesFaculties = () => {
  const { data: programmes } = useSWR(`${endpoints.programmes}`, async (url) => {
    const res = await apiClient.get<Programme[]>(url);
    return res.data;
  });

  return (
    <PageLayout siteTitle="Course Faculties">
      <div className="mt-2">
        <h1 className="text-center">Proficiency Programmes</h1>
        <div className="text-center mb-3">
          Deploy eUniversity as a global point-of-reference in the use of digital learning to
          transform society in wealth creation.
        </div>
        <div className={styles.courseList}>
          {programmes &&
            programmes.map((programme) => (
              <CourseSummaryCard
                programmeId={programme.id}
                title={programme.name}
                key={programme.name}
                description={programme.description}
                duration={programme.durationInMonths}
                degree={programme.isDegree}
                diploma={programme.isDiploma}
                certificate={programme.isCertificate}
                postgraduate={programme.isPostgraduate}
              />
            ))}
        </div>
        {!programmes && <CardSkeleton number={8} />}
      </div>
    </PageLayout>
  );
};

export default CoursesFaculties;
