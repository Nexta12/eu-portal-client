import React, { useMemo, useState } from 'react';
import { Alert, Button } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { AntTable } from '@components/Table';
import { CurrentSemester, SemesterCourse } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import AcademicsSummaryCard from '@pages/Courses/AcademicsSummaryCard';
import NoRegisteredSemester from '@pages/Dashboard/NoRegisteredSemester';
import { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<Pick<SemesterCourse, 'name' | 'code' | 'unit'>> = [
  {
    title: 'S/No',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'Course Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Course Code',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: 'Course Unit',
    dataIndex: 'unit',
    key: 'unit'
  },
  {
    title: 'Facilitator',
    dataIndex: 'facilitator',
    key: 'facilitator'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action'
  }
];

const Enrolments = () => {
  const { data: currentSemester, isLoading } = useSWR(
    endpoints.currentSemester,
    async (url: string) => {
      const response = await apiClient.get<CurrentSemester>(url);
      return response.data;
    }
  );
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const courses = useMemo(
    () =>
      currentSemester?.courses
        .filter(({ isPaid }) => isPaid)
        .map(({ name, code, unit }, index) => ({
          key: `${name}${index + 1}`,
          sn: index + 1,
          name,
          code,
          unit,
          facilitator: '-',
          action: (
            <div className="d-flex gap-1">
              <Button type="primary">Take Class</Button>
            </div>
          )
        })) || [],
    [currentSemester]
  );

  return (
    <DashboardContentLayout
      title="My Enrollments"
      description="These are the courses registered for the current semester"
    >
      {(message.success || message.error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      {currentSemester ? (
        <>
          <AcademicsSummaryCard
            cohort={currentSemester?.cohort}
            semester={currentSemester?.semester}
            level={currentSemester?.level}
            programme={currentSemester?.programme}
          />
          <AntTable
            columns={columns}
            dataSource={courses}
            loading={isLoading}
            emptyText="Student does not have any enrolled courses"
          />
        </>
      ) : (
        <NoRegisteredSemester setMessage={setMessage} />
      )}
    </DashboardContentLayout>
  );
};

export default Enrolments;
