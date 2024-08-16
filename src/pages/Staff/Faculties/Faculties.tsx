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
import { Faculty } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { formatDate } from '@utils/helpers';
import { getAxiosError } from '@utils/http';
import { ColumnsType } from 'antd/es/table';

type FacultyType = Pick<Faculty, 'name' | 'createdAt'>;

const Column: ColumnsType<FacultyType> = [
  {
    title: 'S/No',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const Faculties = () => {
  const navigate = useNavigate();
  const {
    data: faculties,
    isLoading,
    error,
    mutate
  } = useSWR(endpoints.getFaculties, async (url) => {
    const response = await apiClient.get<Faculty[]>(url);
    return response.data;
  });
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleDeleteFaculty = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteFaculty}/${id}`);
      setMessage({ error: null, success: 'Faculty deleted successfully' });
      await mutate();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const facultyList =
    faculties?.map(({ id, name, createdAt }, index) => ({
      key: id,
      sn: index + 1,
      name,
      createdAt: createdAt ? formatDate(createdAt) : '',
      actions: (
        <div className="d-flex align-items-center gap-1">
          <Button onClick={() => navigate(`${paths.editFaculty}/${id}`)}>Edit</Button>
          <Button
            onClick={() => {
              setOpenConfirmationModal(true);
              setIsDeleting(id);
            }}
          >
            <LuTrash2 size={20} color={colorPrimary} />
          </Button>
        </div>
      )
    })) || [];

  return (
    <DashboardContentLayout
      title="Faculties"
      description="List of Faculties at E-University Africa"
    >
      <div className="d-flex justify-content-end m-2">
        <Button type="primary" size="large" onClick={() => navigate(paths.newFaculty)}>
          Create new Faculty
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
      <AntTable columns={Column} dataSource={facultyList} loading={isLoading} />
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={async () => {
          setOpenConfirmationModal(false);
          await handleDeleteFaculty(isDeleting);
        }}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
      >
        <div>Are you sure you want to delete this faculty?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default Faculties;
