import React from 'react';
import { FaRegEnvelope } from 'react-icons/fa';
import { FaUsers, FaUsersGear } from 'react-icons/fa6';
import { MdOutlineEventNote } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { AntTable } from '@components/Table';
import { AntTag } from '@components/Tag';
import { Programme } from '@customTypes/courses';
import { Event } from '@customTypes/events';
import { Report } from '@customTypes/tickets';
import { AdmissionStatus, Cohort, Gender, StudentProfile } from '@customTypes/user';
import { paths } from '@routes/paths';
import { ColumnsType } from 'antd/es/table';
import style from './Admin.module.scss';

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: studentList, isLoading } = useSWR(
    `${endpoints.students}?admissionStatus=${AdmissionStatus.ADMITTED}`,
    async (url: string) => {
      const result = await apiClient.get<StudentProfile[]>(url);
      return result.data;
    }
  );

  const { data: studentListInReview } = useSWR(
    `${endpoints.students}?admissionStatus=${AdmissionStatus.IN_REVIEW}`,
    async (url: string) => {
      const result = await apiClient.get<StudentProfile[]>(url);
      return result.data;
    }
  );

  const { data: events } = useSWR(endpoints.getEvents, async (url) => {
    const response = await apiClient.get<Event[]>(url);
    return response.data;
  });

  const { data: reports } = useSWR(`${endpoints.getAllReports}`, async (url: string) => {
    const response = await apiClient.get<Report[]>(url);
    return response.data;
  });

  const students =
    studentList
      ?.slice(0, 6)
      .map(
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
    <main>
      <div className={style.card}>
        <div className={style.singleCard}>
          <div className={style.top}>
            <p>Total Leaners</p>
            <FaUsers className={style.even} />
          </div>
          <div className={style.bottom}>{studentList?.length || 0}</div>
        </div>
        <div className={style.singleCard}>
          <div className={style.top}>
            <p>Admission In Review</p>
            <FaUsersGear className={style.odd} />
          </div>
          <div className={style.bottom}>{studentListInReview?.length || 0}</div>
        </div>
        <div className={style.singleCard}>
          <div className={style.top}>
            <p>Support Tickets</p>
            <FaRegEnvelope className={style.even} />
          </div>
          <div className={style.bottom}>{reports?.length || 0}</div>
        </div>
        <div className={style.singleCard}>
          <div className={style.top}>
            <p>Upcoming Activity</p>
            <MdOutlineEventNote className={style.odd} />
          </div>
          <div className={style.bottom}>{events?.length || 0}</div>
        </div>
      </div>
      <div className={style.midSection}>
        <h2>Newly Admitted Learners</h2>
        <AntTable columns={Column} dataSource={students} loading={isLoading} />
      </div>
    </main>
  );
};

export default AdminDashboard;
