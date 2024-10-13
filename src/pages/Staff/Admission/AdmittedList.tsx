import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { AntTable } from '@components/Table';
import { AntTag } from '@components/Tag';
import { Programme } from '@customTypes/courses';
import { AdmissionStatus, Cohort, Gender, StudentProfile } from '@customTypes/user';
import { paths } from '@routes/paths';
import { ColumnsType } from 'antd/es/table';

export const admissionStatusTag = {
  [AdmissionStatus.ADMITTED]: <AntTag color="green" text="Admitted" />,
  [AdmissionStatus.IN_REVIEW]: <AntTag color="yellow" text="In review" />,
  [AdmissionStatus.APPLICATION]: <AntTag color="blue" text="Application" />,
  [AdmissionStatus.APPLICATION_FEE_PAID]: <AntTag color="orange" text="Fee paid" />,
  [AdmissionStatus.REJECTED]: <AntTag color="red" text="Rejected" />
};

type Admission = Pick<
  StudentProfile,
  'firstName' | 'lastName' | 'gender' | 'cohort' | 'programme' | 'admissionStatus'
>;

const Column: ColumnsType<Admission> = [
  {
    title: 'S/NO',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName'
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName'
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender'
  },
  {
    title: 'Cohort',
    dataIndex: 'cohort',
    key: 'cohort'
  },
  {
    title: 'Admission Status',
    dataIndex: 'admissionStatus',
    key: 'admissionStatus',
    render: (admissionStatus: AdmissionStatus) => admissionStatusTag[admissionStatus]
  },
  {
    title: 'Details',
    dataIndex: 'details',
    key: 'details'
  }
];

const AdmittedList = () => {
  const navigate = useNavigate();
  const { data: studentList, isLoading } = useSWR(
    `${endpoints.students}?admissionStatus=${AdmissionStatus.ADMITTED}`,
    async (url: string) => {
      const result = await apiClient.get<StudentProfile[]>(url);
      return result.data;
    }
  );
  const students =
    studentList?.map(
      ({ userId, firstName, lastName, gender, cohort, programme, admissionStatus }, index) => ({
        key: index + 1,
        sn: index + 1,
        firstName,
        lastName,
        gender: gender as Gender,
        cohort: cohort as Cohort,
        programme: programme as Programme,
        admissionStatus: admissionStatus as AdmissionStatus,
        details: (
          <Button onClick={() => navigate(`${paths.admissionDetails}/${userId}`)}>Details</Button>
        )
      })
    ) || [];

  return (
    <DashboardContentLayout title="Admissions List" description="List of Admitted Learners">
      <AntTable columns={Column} dataSource={students} loading={isLoading} />
    </DashboardContentLayout>
  );
};

export default AdmittedList;
