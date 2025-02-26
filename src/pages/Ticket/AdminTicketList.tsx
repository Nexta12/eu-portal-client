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
import { MappedReport, Report, SupportTicketStatus } from '@customTypes/tickets';
import { useSocket } from '@hooks/useSocket';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { capitalizeWords, formatDate } from '@utils/helpers';
import { getAxiosError } from '@utils/http';
import { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<MappedReport> = [
  {
    title: 'S/No',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'Ticket No',
    dataIndex: 'ticketNo',
    key: 'ticketNo'
  },
  {
    title: 'Subject',
    dataIndex: 'subject',
    key: 'subject'
  },
  {
    title: 'Message',
    dataIndex: 'snippet',
    key: 'snippet'
  },
  {
    title: 'Created By',
    dataIndex: 'student',
    key: 'student'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let statusClass = '';
      switch (status) {
        case SupportTicketStatus.OPEN: {
          statusClass = 'status-open';
          break;
        }
        case SupportTicketStatus.CLOSED: {
          statusClass = 'status-closed';
          break;
        }

        case SupportTicketStatus.AWAITING_STUDENT_REPLY: {
          statusClass = 'status-awaiting-reply';
          break;
        }

        default: {
          statusClass = 'status-default';
        }
      }
      return (
        <span
          className={statusClass}
          title={
            status === SupportTicketStatus.AWAITING_STUDENT_REPLY
              ? 'Awaiting Student Reply'
              : SupportTicketStatus.AWAITING_ADMIN_REPLY
              ? 'Awaiting Admin Reply'
              : SupportTicketStatus.CLOSED
              ? 'Ticket Closed'
              : SupportTicketStatus.OPEN
              ? 'Ticket is open'
              : ''
          }
        >
          {status}
        </span>
      );
    }
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

const AdminTicketList = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const {
    data: reports,
    isLoading,
    error,
    mutate
  } = useSWR(`${endpoints.getAllReports}`, async (url: string) => {
    const response = await apiClient.get<Report[]>(url);
    return response.data;
  });
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleDeleteReport = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteReports}/${id}`);
      setMessage({ error: null, success: 'Report deleted successfully' });
      await mutate();
      socket?.emit('getUnreadTickets');
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reportList: MappedReport[] =
    reports?.map(({ id, ticketNo, subject, snippet, student, status, createdAt }, index) => ({
      key: id,
      sn: index + 1,
      ticketNo: `#${ticketNo}`,
      subject,
      snippet: `${snippet} ...`,
      student: capitalizeWords(`${student.firstName} ${student.lastName}`),
      status,
      createdAt: createdAt ? formatDate(createdAt) : '',
      actions: (
        <div className="d-flex align-items-center gap-1">
          <Button onClick={() => navigate(`${paths.tickets}/${id}`)}>View</Button>
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
    <DashboardContentLayout title="Support Tickets">
      {(message.success || message.error || error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      <AntTable columns={columns} dataSource={reportList} loading={isLoading} />
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={async () => {
          setOpenConfirmationModal(false);
          await handleDeleteReport(isDeleting);
        }}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
      >
        <div>Are you sure you want to delete this Ticket with all threads?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default AdminTicketList;
