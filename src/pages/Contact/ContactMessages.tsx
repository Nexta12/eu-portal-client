import React, { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { Alert, Button } from 'antd';
import useSWR, { mutate } from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { CustomModal } from '@components/Modal';
import { AntTable } from '@components/Table';
import { AlertMessage } from '@customTypes/general';
import { ContactMessages } from '@customTypes/messages';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { formatDate } from '@utils/helpers';
import { getAxiosError } from '@utils/http';
import { ColumnsType } from 'antd/es/table';

type ContactMessagesType = Pick<
  ContactMessages,
  'firstName' | 'lastName' | 'snippet' | 'createdAt'
>;

const columns: ColumnsType<
  ContactMessagesType & { key: string; sn: number; actions: JSX.Element }
> = [
  {
    title: 'S/No',
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
    title: 'Message',
    dataIndex: 'snippet',
    key: 'snippet'
  },
  {
    title: 'Creation Date',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const Messages = () => {
  const navigate = useNavigate();
  const {
    data: contactMessages = [],
    error,
    isLoading
  } = useSWR<ContactMessages[]>(endpoints.getAllContactMessage, async (url) => {
    const response = await apiClient.get<ContactMessages[]>(url);
    return response.data;
  });

  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleDeleteEvent = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteContactMessage}/${id}`);
      setMessage({ error: null, success: 'Message deleted successfully' });
      await mutate(endpoints.getAllContactMessage);
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const messagesList = Array.isArray(contactMessages)
    ? contactMessages.map(({ id, firstName, lastName, snippet, createdAt }, index) => ({
        key: id,
        sn: index + 1,
        firstName,
        lastName,
        snippet: snippet ? `${snippet} ...` : '',
        createdAt: createdAt ? formatDate(createdAt) : '',
        actions: (
          <div className="d-flex align-items-center gap-1">
            <Button onClick={() => navigate(`${paths.viewMessages}/${id}`)}>View</Button>
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
      }))
    : [];

  return (
    <DashboardContentLayout title="Inquiry Messages">
      {(message.success || message.error || error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      <AntTable columns={columns} dataSource={messagesList} loading={isLoading} />
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
        <div>Are you sure you want to delete this message?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default Messages;
