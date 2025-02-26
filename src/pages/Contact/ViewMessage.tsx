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
import { ContactMessages } from '@customTypes/messages';
import { useSocket } from '@hooks/useSocket';
import styles from '@pages/Staff/Programmes/Programmes.module.scss';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';

const ViewContactMessage = () => {
  const socket = useSocket();
  const [form] = Form.useForm();
  const params = useParams();
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [receiverName, setReceiverName] = useState<string>('');
  const [receiverEmail, setReceiverEmail] = useState<string>('');
  const [receivedMessage, setReceivedMessage] = useState<string>('');
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const { data: contactMessage } = useSWR(
    `${endpoints.getAllContactMessage}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.get<SuccessResponse<ContactMessages>>(url);
      return response.data.data;
    }
  );

  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.replyContactMessage}/${params.id}`,
    async (url: string) => {
      const details = {
        firstName,
        lastName,
        email: receiverEmail,
        message: DOMPurify.sanitize(replyMessage, { ALLOWED_TAGS: [] })
      };

      const res = await apiClient.put(url, details);
      return res.data;
    }
  );

  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({ success: 'Reply Email Sent Successfully', error: null });
      setReplyMessage('');
      form.resetFields();
    } catch (error) {
      const axiosError = getAxiosError(error);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  useEffect(() => {
    if (contactMessage) {
      setReceiverName(`${contactMessage.firstName} ${contactMessage.lastName}`);
      setReceiverEmail(`${contactMessage.email}`);
      setReceivedMessage(`${contactMessage.message}`);
      setFirstName(`${contactMessage.firstName}`);
      setLastName(`${contactMessage.lastName}`);
      form.setFieldsValue({
        receiver: `${contactMessage.firstName} ${contactMessage.lastName}`,
        email: contactMessage.email
      });
    }
  }, [contactMessage, form]);

  useEffect(() => {
    if (socket) {
      socket.emit('getUnreadMessages');
    }
  }, [socket]);
  return (
    <DashboardContentLayout title="Reply Inquiry Message via email" description="">
      <div className="d-flex flex-direction-column gap-2 p-2 align-items-center">
        <div className={styles.messageBox}>
          <p className={styles.receivedMsg}>{receivedMessage}</p>
          {contactMessage?.reply && <p className={styles.sentMessage}>{contactMessage?.reply}</p>}
        </div>
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
            <div className={styles.grid}>
              <InputField name="receiver" label="Send Email to" value={receiverName} />
              <InputField name="email" label="Receiver Email" value={receiverEmail} />
            </div>
            <TextEditor
              placeholder="Write something..."
              label="Message"
              value={replyMessage}
              onChange={setReplyMessage}
            />
            <Button
              type="primary"
              size="large"
              className="mt-2"
              block
              htmlType="submit"
              loading={isMutating}
            >
              Send a reply
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default ViewContactMessage;
