import React, { useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, MenuProps, Space } from 'antd';
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

const Admissions = () => {
  const navigate = useNavigate();
  const [selectedLabel, setSelectedLabel] = useState(AdmissionStatus.IN_REVIEW);

  const { data: studentList, isLoading } = useSWR(
    `${endpoints.students}?admissionStatus=${selectedLabel}`,
    async (url: string) => {
      const result = await apiClient.get<StudentProfile[]>(url);
      return result.data;
    }
  );

  const items: MenuProps['items'] = [
    {
      label: AdmissionStatus.ADMITTED,
      key: 'Admitted',
      onClick: () => setSelectedLabel(AdmissionStatus.ADMITTED)
    },
    {
      label: AdmissionStatus.APPLICATION,
      key: 'Application',
      onClick: () => setSelectedLabel(AdmissionStatus.APPLICATION)
    },
    {
      label: AdmissionStatus.APPLICATION_FEE_PAID,
      key: 'Paid application fee',
      onClick: () => setSelectedLabel(AdmissionStatus.APPLICATION_FEE_PAID)
    },
    {
      label: AdmissionStatus.IN_REVIEW,
      key: 'In_review',
      onClick: () => setSelectedLabel(AdmissionStatus.IN_REVIEW)
    },
    {
      label: AdmissionStatus.REJECTED,
      key: 'Rejected',
      onClick: () => setSelectedLabel(AdmissionStatus.REJECTED)
    }
  ];

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
    <DashboardContentLayout
      title="Admissions"
      description={`These are the students whose application status is "${selectedLabel}"`}
    >
      <div className="d-flex justify-content-end mb-1">
        <Dropdown menu={{ items }} trigger={['click']} className="width-25">
          <Button onClick={(e) => e.preventDefault()}>
            <Space>
              Sort by:
              {selectedLabel}
              <RiArrowDropDownLine />
            </Space>
          </Button>
        </Dropdown>
      </div>
      <AntTable columns={Column} dataSource={students} loading={isLoading} />
    </DashboardContentLayout>
  );
};

export default Admissions;
