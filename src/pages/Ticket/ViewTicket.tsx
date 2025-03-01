import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from 'antd';
import DOMPurify from 'dompurify';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { MessagesSection, TicketInfoSection } from '@components/Ticket';
import styles from '@components/Ticket/Ticket.module.scss';
import { AlertMessage, SuccessResponse } from '@customTypes/general';
import { Report, ReportConversations } from '@customTypes/tickets';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { Socket, io } from 'socket.io-client';
import useSWRMutation from 'swr/mutation';

const ViewTicket: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const serverUrl = process.env.REACT_APP_WS_SERVER || 'ws://0.0.0.0:4000';
    const socketInstance = io(serverUrl);
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);// hello

  useEffect(() => {
    if (socket) {
      socket.emit('getUnreadTickets');
      socket.emit('markStudentTicketAsRead', { data: params?.id });
    }
  }, [socket, params?.id]);

  const { data: ticket } = useSWR(
    params.id ? `${endpoints.getAllReports}/${params.id}` : null,
    async (url: string) => {
      const response = await apiClient.get<SuccessResponse<Report>>(url);
      return response.data.data;
    }
  );

  const { data: reportConversations, error } = useSWR(
    params.id ? `${endpoints.getOneReportAllConversations}/${params.id}` : null,
    async (url: string) => {
      const response = await apiClient.get<SuccessResponse<ReportConversations[]>>(url);
      return response.data.data;
    }
  );
  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.createReportConversation}/${params.id}`,
    async (url: string) => {
      const res = await apiClient.post(url, {
        message: DOMPurify.sanitize(replyMessage, { ALLOWED_TAGS: [] })
      });
      return res.data;
    }
  );

  const { trigger: closeTicketTrigger, isMutating: isClosing } = useSWRMutation(
    `${endpoints.closeReport}/${params.id}`,
    async (url: string) => {
      const res = await apiClient.put(url);
      return res.data;
    }
  );

  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({ error: null, success: 'Support Ticket Submitted successfully' });
      setReplyMessage('');
      form.resetFields();
      window.location.reload();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClosed = async () => {
    try {
      await closeTicketTrigger();
      setMessage({ error: null, success: 'Support Ticket Marked Closed' });
      window.location.reload();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  return (
    <DashboardContentLayout title="Support Ticket Subject">
      <div className={styles.messagesBody}>
        <MessagesSection
          ticket={ticket}
          reportConversations={reportConversations}
          error={error}
          message={message}
          setMessage={setMessage}
          formRef={formRef}
          handleOnFinish={handleOnFinish}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
          form={form}
          isMutating={isMutating}
        />
        <TicketInfoSection
          ticket={ticket}
          isClosing={isClosing}
          scrollToForm={scrollToForm}
          handleClosed={handleClosed}
        />
      </div>
    </DashboardContentLayout>
  );
};

export default ViewTicket;
