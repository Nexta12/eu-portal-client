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
import { AntTag } from '@components/Tag';
import { Programme } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import { AdmissionStatus, Cohort, Gender, StudentProfile } from '@customTypes/user';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
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

const NewApplicants = () => {
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const navigate = useNavigate();
  const {
    data: studentList,
    mutate,
    isLoading
  } = useSWR(
    `${endpoints.students}?admissionStatus=${AdmissionStatus.APPLICATION}`,
    async (url: string) => {
      const result = await apiClient.get<StudentProfile[]>(url);
      return result.data;
    }
  );

  const handleDeleteStudent = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteStudent}/${id}`);
      setMessage({ error: null, success: 'Deleted successfully' });
      await mutate();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
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
          <div className="d-flex align-items-center gap-1">
            <Button onClick={() => navigate(`${paths.admissionDetails}/${userId}`)}>Details</Button>
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
    ) || [];

  return (
    <DashboardContentLayout
      title="New Applications"
      description="These are learners who have neither paid processing fee nor uploaded any documents (Ineligible for Admission)"
    >
      {(message.success || message.error || '') && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      <AntTable columns={Column} dataSource={students} loading={isLoading} />
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={async () => {
          setOpenConfirmationModal(false);
          await handleDeleteStudent(isDeleting);
        }}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
      >
        <div>Are you sure you want to delete this Student?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default NewApplicants;
