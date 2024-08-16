import React, { useState } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { Alert, Button, Form } from 'antd';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField } from '@components/Form';
import { PageLayout } from '@components/Layout';
import { AlertMessage } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { HttpErrorStatusCode, getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';
import styles from './resetPassword.module.scss';

const defaultAlertMessage = { error: null, success: null };

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [message, setMessage] = useState<AlertMessage>(defaultAlertMessage);
  const [email, setEmail] = useState<string>('');

  const { trigger, isMutating: isLoading } = useSWRMutation(
    endpoints.forgotPassword,
    async (url) => {
      const response = await apiClient.post(url, { email });
      return response.data;
    }
  );

  const sendEmail = async () => {
    try {
      setMessage({ error: null, success: null });
      const result = await trigger();
      setMessage({ error: null, success: result.message });
      form.resetFields();
    } catch (err) {
      form.resetFields();
      const { errorData, statusCode } = getAxiosError(err);
      const errorMessage =
        statusCode === HttpErrorStatusCode.NOT_FOUND ||
        statusCode === HttpErrorStatusCode.UNPROCESSABLE_ENTITY
          ? formatErrors(errorData)
          : 'An error occurred. Try again';
      setMessage({ error: errorMessage, success: null });
    }
  };

  return (
    <PageLayout
      className="d-flex align-items-center flex-direction-column"
      siteTitle="Forgot password"
    >
      {message.success ? (
        <div className="pb-5 text-center">
          <BsCheckCircleFill size={60} color="green" />
          <h1 className="mt-2">Thank you</h1>
          <div className="mt-1 mb-2">
            An email has been sent to your mail box. Please follow instructions there.
          </div>
        </div>
      ) : (
        <div className={styles.resetContainer}>
          <h1 className="text-center">Forgot password?</h1>
          <div className="mb-2 text-center">Enter your registered email to proceed.</div>
          {message.error && (
            <Alert
              type="error"
              message={message.error}
              className="width-100"
              closable
              onClose={() => setMessage(defaultAlertMessage)}
            />
          )}
          <FormWrapper form={form} onFinish={sendEmail}>
            <InputField
              label="Email"
              name="email"
              placeholder="Enter registered email"
              value={email}
              rules={[{ required: true }, { type: 'email', message: 'Please enter a valid email' }]}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="primary" size="large" htmlType="submit" block loading={isLoading}>
              Proceed
            </Button>
          </FormWrapper>
        </div>
      )}
    </PageLayout>
  );
};

export default ForgotPassword;
