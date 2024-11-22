import React, { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { Alert, Button } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { CustomModal } from '@components/Modal';
import { AntTable } from '@components/Table';
import { AlertMessage } from '@customTypes/general';
import { StudentProfile, UserRole } from '@customTypes/user';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { formatDate } from '@utils/helpers';
import { getAxiosError } from '@utils/http';
import { capitalize } from '@utils/letterFormatter';
import { ColumnsType } from 'antd/es/table';

type StaffType = Pick<
  StudentProfile,
  'userId' | 'firstName' | 'lastName' | 'email' | 'role' | 'createdAt'
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
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const Staffs = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(endpoints.staffs, async (url) => {
    const response = await apiClient.get(url);
    return response.data;
  });

  const handleDeleteEvent = async (userId: string) => {
    try {
      setIsDeleting(userId);
      await apiClient.delete(`${endpoints.staffDelete}/${userId}`);
      setMessage({ error: null, success: 'Staff deleted successfully' });
      await mutate();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const staffs: StaffType[] = data || [];
  const staffList = staffs?.map(
    ({ userId, firstName, lastName, role, email, createdAt }, index) => ({
      userId,
      key: index + 1,
      sn: index + 1,
      firstName,
      lastName,
      email,
      role: role as UserRole,
      createdAt: formatDate(createdAt),
      actions: (
        <div className="d-flex align-items-center gap-1">
          <Button onClick={() => navigate(`${paths.viewStaff}/${userId}`)}>View</Button>
          {/* <Button onClick={() => navigate(`${paths.editStaff}/${userId}`)}>Edit</Button> */}
          <Button
            onClick={() => {
              setOpenConfirmationModal(true);
              setIsDeleting(userId);
            }}
          >
            <LuTrash2 size={20} color={colorPrimary} />
          </Button>
        </div>
      )
    })
  );

  return (
    <DashboardContentLayout title="Staff" description="List of Staff at E-University Africa">
      <div className="d-flex justify-content-end m-2">
        <Button type="primary" size="large" onClick={() => navigate(paths.newStaff)}>
          Create new Staff
        </Button>
      </div>
      {(message.success || message.error || error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      <AntTable columns={Column} dataSource={staffList} loading={isLoading} />
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={async () => {
          setOpenConfirmationModal(false);
          await handleDeleteEvent(isDeleting);
        }}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
      >
        <div>Are you sure you want to delete this staff?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default Staffs;
