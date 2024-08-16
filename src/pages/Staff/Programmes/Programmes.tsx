import React, { useMemo, useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { Alert, Button } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { CustomModal } from '@components/Modal';
import { AntTable } from '@components/Table';
import { AntTag } from '@components/Tag';
import { Faculty, Programme } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { ColumnsType } from 'antd/es/table';

type ProgrammesType = Pick<
  Programme,
  | 'name'
  | 'isCertificate'
  | 'isDiploma'
  | 'isDegree'
  | 'isPostgraduate'
  | 'durationInMonths'
  | 'faculty'
>;

const renderTag = (value: boolean) =>
  value ? <AntTag color="green" text="Yes" /> : <AntTag color="red" text="No" />;

const Column: ColumnsType<ProgrammesType> = [
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
    title: 'Faculty',
    dataIndex: 'faculty',
    key: 'faculty'
  },
  {
    title: 'Duration(months)',
    dataIndex: 'durationInMonths',
    key: 'durationInMonths'
  },
  {
    title: 'Certificate',
    dataIndex: 'isCertificate',
    key: 'isCertificate',
    render: renderTag
  },
  {
    title: 'Diploma',
    dataIndex: 'isDiploma',
    key: 'isDiploma',
    render: renderTag
  },
  {
    title: 'Degree',
    dataIndex: 'isDegree',
    key: 'isDegree',
    render: renderTag
  },
  {
    title: 'Postgraduate',
    dataIndex: 'isPostgraduate',
    key: 'isPostgraduate',
    render: renderTag
  },
  {
    title: 'Action',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const Programmes = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const {
    data: programmes,
    isLoading,
    mutate
  } = useSWR(`${endpoints.programmes}?withFaculty=true`, async (url) => {
    const response = await apiClient.get<Programme[]>(url);
    return response.data;
  });
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string>('');

  const programmesList = useMemo(
    () =>
      programmes?.map((programme, index) => ({
        key: programme.id,
        sn: index + 1,
        name: programme.name,
        faculty: (programme.faculty as Faculty)?.name,
        durationInMonths: programme.durationInMonths,
        isCertificate: programme.isCertificate,
        isDiploma: programme.isDiploma,
        isDegree: programme.isDegree,
        isPostgraduate: programme.isPostgraduate,
        actions: (
          <div className="d-flex align-items-center gap-1">
            <Button onClick={() => navigate(`${paths.viewProgramme}/${programme.id}`)}>View</Button>
            <Button
              onClick={() => {
                setOpenConfirmationModal(true);
                setIsDeleting(programme.id);
              }}
            >
              <LuTrash2 size={20} color={colorPrimary} />
            </Button>
          </div>
        )
      })) || [],
    [navigate, programmes]
  );

  const handleDeleteProgramme = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteProgramme}/${id}`);
      setMessage({ error: null, success: 'Faculty deleted successfully' });
      await mutate();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardContentLayout
      title="Programmes"
      description="List of Programmes at E-University Africa"
    >
      <div className="d-flex justify-content-end m-2">
        <Button type="primary" size="large" onClick={() => navigate(paths.createProgramme)}>
          Create new Programme
        </Button>
      </div>
      {(message.success || message.error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      <AntTable columns={Column} dataSource={programmesList} loading={isLoading} />
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={async () => {
          setOpenConfirmationModal(false);
          await handleDeleteProgramme(isDeleting);
        }}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
      >
        <div>Are you sure you want to delete this Programme?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default Programmes;
