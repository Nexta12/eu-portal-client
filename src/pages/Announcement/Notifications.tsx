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
import { MappedNotification, Notifications as Notification } from '@customTypes/notifications';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { capitalizeWords, formatDate } from '@utils/helpers';
import { getAxiosError } from '@utils/http';
import { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<MappedNotification> = [
  {
    title: 'S/No',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'Broadcast Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Broadcast Message',
    dataIndex: 'message',
    key: 'message'
  },
  {
    title: 'Severity',
    dataIndex: 'level',
    key: 'level'
  },
  {
    title: 'Created By',
    dataIndex: 'author',
    key: 'author'
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

const Notifications = () => {
  const navigate = useNavigate();

  const {
    data: broadcasts,
    isLoading,
    error,
    mutate
  } = useSWR(endpoints.getNotifications, async (url) => {
    const response = await apiClient.get<Notification[]>(url);
    return response.data;
  });

  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleDeleteNotification = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteNotification}/${id}`);
      setMessage({ error: null, success: 'Notification deleted successfully' });
      await mutate();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const broadcastList: MappedNotification[] =
    broadcasts?.map(
      ({ id, title, author, message: notificationMessage, level, createdAt }, index) => ({
        key: id,
        sn: index + 1,
        title,
        message: notificationMessage,
        level: capitalizeWords(level),
        author: capitalizeWords(`${author.firstName} ${author.lastName}`),
        createdAt: createdAt ? formatDate(createdAt) : '',
        actions: (
          <div className="d-flex align-items-center gap-1">
            <Button onClick={() => navigate(`${paths.editNotification}/${id}`)}>Edit</Button>
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
      })
    ) || [];

  return (
    <DashboardContentLayout
      title="Broadcast Messages"
      description="List of all broadcast messages available to student dashboard"
    >
      <div className="d-flex justify-content-end m-2">
        <Button type="primary" size="large" onClick={() => navigate(paths.newNotification)}>
          New Broadcast Message
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
      <AntTable columns={columns} dataSource={broadcastList} loading={isLoading} />
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={async () => {
          setOpenConfirmationModal(false);
          await handleDeleteNotification(isDeleting);
        }}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
      >
        <div>Are you sure you want to delete this broadcast message?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default Notifications;
