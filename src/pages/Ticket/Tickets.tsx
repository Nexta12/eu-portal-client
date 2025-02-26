import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { AntTable } from '@components/Table';
import { AlertMessage } from '@customTypes/general';
import { MappedReport, Report, SupportTicketStatus } from '@customTypes/tickets';
import { paths } from '@routes/paths';
import useAuthStore from '@store/authStore';
import { capitalizeWords, formatDate } from '@utils/helpers';
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

const Tickets = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    data: reports,
    isLoading,
    error
  } = useSWR(`${endpoints.getOneStudentAllReports}/${user?.userId}`, async (url: string) => {
    const response = await apiClient.get<Report[]>(url);
    return response.data;
  });
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const reportList: MappedReport[] =
    reports?.map(({ id, ticketNo, subject, snippet, student, status, createdAt }, index) => ({
      key: id,
      sn: index + 1,
      ticketNo: `#${ticketNo}`,
      subject,
      snippet: `${snippet} ...`,
      student: capitalizeWords(`${student.firstName} ${student.lastName}`), // unnecessary but to remove errors
      status,
      createdAt: createdAt ? formatDate(createdAt) : '',
      actions: (
        <div className="d-flex align-items-center gap-1">
          <Button onClick={() => navigate(`${paths.editTicket}/${id}`)}>Edit</Button>
          <Button onClick={() => navigate(`${paths.tickets}/${id}`)}>View</Button>
        </div>
      )
    })) || [];

  return (
    <DashboardContentLayout title="My Support Tickets">
      <div className="d-flex justify-content-end m-2">
        <Button type="primary" size="large" onClick={() => navigate(paths.newTicket)}>
          + Open new ticket
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
      <AntTable columns={columns} dataSource={reportList} loading={isLoading} />
    </DashboardContentLayout>
  );
};

export default Tickets;
