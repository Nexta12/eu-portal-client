import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Form } from 'antd';
import DOMPurify from 'dompurify';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { TextEditor } from '@components/TextEditor';
import { AlertMessage } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { Socket, io } from 'socket.io-client';
import useSWRMutation from 'swr/mutation';


const NewTicket = () => {
  const [form] = Form.useForm();
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  useEffect(() => {
    const socketInstance = io('ws://185.170.196.112/:4000');
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const { trigger, isMutating } = useSWRMutation(endpoints.createReport, async (url: string) => {
    const res = await apiClient.post(url, {
      subject: ticketSubject,
      message: DOMPurify.sanitize(ticketMessage, { ALLOWED_TAGS: [] })
    });
    return res.data;
  });

  const handleOnFinish = async () => {
    try {
      await trigger();
      socket?.emit('getUnreadTickets');
      setMessage({ error: null, success: 'Support Ticket Submitted successfully' });
      setTicketSubject('');
      setTicketMessage('');
      form.resetFields();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  return (
    <DashboardContentLayout
      title="Create New Support Ticket"
      description="Pass a message to Admin or management"
    >
      <div className="d-flex flex-direction-column gap-2 p-2 align-items-center">
        {(message.success || message.error) && (
          <Alert
            type={message.error ? 'error' : 'success'}
            message={message.error ?? message.success}
            className="width-100"
            closable
            onClose={() => setMessage({ error: null, success: null })}
          />
        )}
        <Card className="width-100 p-1">
          <FormWrapper
            className="d-flex flex-direction-column"
            onFinish={handleOnFinish}
            form={form}
          >
            <div className="d-flex gap-2">
              <InputField
                name="subject"
                label="Subject"
                placeholder="Title of your ticket"
                rules={[{ required: true }]}
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>
            <TextEditor
              placeholder="Write something..."
              label="Description"
              value={ticketMessage}
              onChange={setTicketMessage}
            />
            <Button
              type="primary"
              size="large"
              className="mt-2"
              block
              htmlType="submit"
              loading={isMutating}
            >
              Submit Ticket
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default NewTicket;