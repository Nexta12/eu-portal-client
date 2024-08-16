import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { AntTable } from '@components/Table';
import { AntTag } from '@components/Tag';
import { StudentProfile, UserRole } from '@customTypes/user';
import { paths } from '@routes/paths';
import { formatDate } from '@utils/helpers';
import { capitalize } from '@utils/letterFormatter';
import { ColumnsType } from 'antd/es/table';

type StaffType = Pick<
  StudentProfile,
  'userId' | 'firstName' | 'lastName' | 'email' | 'role' | 'createdAt' | 'isPasswordGenerated'
>;

const Column: ColumnsType<StaffType> = [
  {
    title: 'S/NO',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    render: (firstName: string) => capitalize(firstName)
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
    render: (lastName: string) => capitalize(lastName)
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    render: (role: UserRole) => capitalize(role)
  },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Is Password Generated',
    dataIndex: 'isPasswordGenerated',
    key: 'isPasswordGenerated',
    render: (isPasswordGenerated: boolean) =>
      isPasswordGenerated ? <AntTag color="green" text="Yes" /> : <AntTag color="red" text="No" />
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const Staffs = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useSWR(endpoints.staffs, async (url) => {
    const response = await apiClient.get(url);
    return response.data;
  });

  const staffs: StaffType[] = data || [];
  const staffList = staffs?.map(
    ({ userId, firstName, lastName, role, email, createdAt, isPasswordGenerated }, index) => ({
      userId,
      key: index + 1,
      sn: index + 1,
      firstName,
      lastName,
      email,
      role: role as UserRole,
      isPasswordGenerated,
      createdAt: formatDate(createdAt),
      actions: <Button onClick={() => navigate(`${paths.editStaff}/${userId}`)}>Edit</Button>
    })
  );

  return (
    <DashboardContentLayout title="Staffs" description="List of Staffs at E-University Africa">
      <div className="d-flex justify-content-end m-2">
        <Button type="primary" size="large" onClick={() => navigate(paths.newStaff)}>
          Create new Staff
        </Button>
      </div>
      <AntTable columns={Column} dataSource={staffList} loading={isLoading} />
    </DashboardContentLayout>
  );
};

export default Staffs;
