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
import { Event, MappedEvent } from '@customTypes/events';
import { AlertMessage } from '@customTypes/general';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { capitalizeWords, formatDate } from '@utils/helpers';
import { getAxiosError } from '@utils/http';
import { ColumnsType } from 'antd/es/table';

const Column: ColumnsType<MappedEvent> = [
  {
    title: 'S/No',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'Activity Name',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Focus On',
    dataIndex: 'focus',
    key: 'focus'
  },
  {
    title: 'Activity Date',
    dataIndex: 'eventDate',
    key: 'eventDate'
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

const Events = () => {
  const navigate = useNavigate();

  const {
    data: events,
    isLoading,
    error,
    mutate
  } = useSWR(endpoints.getEvents, async (url) => {
    const response = await apiClient.get<Event[]>(url);
    return response.data;
  });

  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleDeleteEvent = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteEvent}/${id}`);
      setMessage({ error: null, success: 'Activity deleted successfully' });
      await mutate();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const eventList: MappedEvent[] =
    events?.map(({ id, title, author, focus, eventDate, createdAt }, index) => ({
      key: id,
      sn: index + 1,
      title,
      author: capitalizeWords(`${author.firstName} ${author.lastName}`),
      focus: capitalizeWords(focus || ''),
      eventDate: eventDate ? formatDate(eventDate) : '',
      createdAt: createdAt ? formatDate(createdAt) : '',
      actions: (
        <div className="d-flex align-items-center gap-1">
          <Button onClick={() => navigate(`${paths.editEvent}/${id}`)}>Edit</Button>
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
      title="List of School Activities"
      description="List of all upcoming and passed school activities"
    >
      <div className="d-flex justify-content-end m-2">
        <Button type="primary" size="large" onClick={() => navigate(paths.newEvent)}>
          Create new
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
      <AntTable columns={Column} dataSource={eventList} loading={isLoading} />
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
        <div>Are you sure you want to delete this activity?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default Events;
