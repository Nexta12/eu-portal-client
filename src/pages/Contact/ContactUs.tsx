import React, { useState } from 'react';
import { Alert, Button, Form } from 'antd';
import DOMPurify from 'dompurify';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField, TextAreaField } from '@components/Form';
import { PageLayout } from '@components/Layout';
import { AlertMessage } from '@customTypes/general';
import { useSocket } from '@hooks/useSocket';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';
import styles from './ContactUs.module.scss';

const ContactUs = () => {
  const [form] = Form.useForm();
  const socket = useSocket();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const { trigger, isMutating } = useSWRMutation(
    endpoints.createContactMessage,
    async (url: string) => {
      const res = await apiClient.post(url, {
        firstName,
        lastName,
        email,
        message: DOMPurify.sanitize(contactMessage, { ALLOWED_TAGS: [] })
      });
      return res.data;
    }
  );

  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({
        error: null,
        success: 'Message Sent, We will get back to you as soon as possible'
      });
      setFirstName('');
      setLastName('');
      setEmail('');
      setContactMessage('');
      form.resetFields();
      if (socket) {
        socket.emit('getUnreadMessages');
      }
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  return (
    <PageLayout siteTitle="Contact Us">
      <h1>Contact Us</h1>
      <div className="lh-md">
        Fill the form below and our dedicated team will get in touch with you as quickly as
        possible.
      </div>
      <FormWrapper className="mt-3" onFinish={handleOnFinish} form={form}>
        {(message.success || message.error) && (
          <Alert
            type={message.error ? 'error' : 'success'}
            message={message.error ?? message.success}
            className="width-100"
            closable
            onClose={() => setMessage({ error: null, success: null })}
          />
        )}
        <div className={styles.grid}>
          <InputField
            placeholder="First Name"
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            placeholder="Last Name"
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <InputField
          placeholder="Email"
          label="Email"
          name="email"
          rules={[{ required: true }]}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextAreaField
          label="Enquiry"
          placeholder="Enquiry"
          name="message"
          value={contactMessage}
          onChange={(e) => setContactMessage(e.target.value)}
        />
        <Button
          type="primary"
          size="large"
          className={styles.actionButton}
          htmlType="submit"
          loading={isMutating}
        >
          Send
        </Button>
      </FormWrapper>
    </PageLayout>
  );
};

export default ContactUs;
