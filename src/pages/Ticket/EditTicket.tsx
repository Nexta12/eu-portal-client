import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Card, Form } from 'antd';
import DOMPurify from 'dompurify';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { TextEditor } from '@components/TextEditor';
import { AlertMessage, SuccessResponse } from '@customTypes/general';
import { Report } from '@customTypes/tickets';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';

const EditTicket = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const { data: ticket } = useSWR(
    `${endpoints.getAllReports}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.get<SuccessResponse<Report>>(url);
      return response.data.data;
    }
  );

  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.editReport}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.put(url, {
        subject: ticketSubject,
        message: DOMPurify.sanitize(ticketMessage, { ALLOWED_TAGS: [] })
      });
      return response.data;
    }
  );

  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({ success: 'Report updated successfully', error: null });
    } catch (error) {
      const axiosError = getAxiosError(error);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  useEffect(() => {
    if (ticket) {
      setTicketSubject(ticket.subject);
      setTicketMessage(ticket.message);
      form.setFieldsValue({ subject: ticket.subject, message: ticket.message });
    }
  }, [ticket, form]);

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

export default EditTicket;
