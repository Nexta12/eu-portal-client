import React, { ChangeEvent, useState } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form } from 'antd';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, PasswordField } from '@components/Form';
import { PageLayout } from '@components/Layout';
import { AlertMessage } from '@customTypes/general';
import { paths } from '@routes/paths';
import { formatErrors } from '@utils/errorFormatter';
import { HttpErrorStatusCode, getAxiosError } from '@utils/http';
import { RuleObject } from 'rc-field-form/lib/interface';
import useSWRMutation from 'swr/mutation';
import styles from './resetPassword.module.scss';

type ResetPasswordTypes = {
  newPassword: string;
  confirmNewPassword: string;
};

const defaultValues: ResetPasswordTypes = {
  newPassword: '',
  confirmNewPassword: ''
};

const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [values, setValues] = useState<ResetPasswordTypes>(defaultValues);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const checkConfirmNewPassword = (_: RuleObject, value: string) => {
    const { newPassword } = form.getFieldsValue();
    if (value && newPassword !== value) {
      return Promise.reject(new Error('Passwords do not match'));
    }
    return Promise.resolve();
  };

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');
  const { newPassword, confirmNewPassword } = values;

  const data = {
    userId,
    token,
    newPassword
  };

  const { trigger, isMutating: isLoading } = useSWRMutation(
    endpoints.resetPassword,
    async (url) => {
      const res = await apiClient.put(url, data);
      return res.data;
    }
  );

  const handleSubmit = async () => {
    try {
      const result = await trigger();
      setMessage({ error: null, success: result.message });
      form.resetFields();
    } catch (err) {
      form.resetFields();
      const { errorData, statusCode } = getAxiosError(err);
      const error =
        statusCode === HttpErrorStatusCode.BAD_REQUEST ||
        statusCode === HttpErrorStatusCode.UNPROCESSABLE_ENTITY ||
        statusCode === HttpErrorStatusCode.NOT_FOUND
          ? formatErrors(errorData)
          : 'An error occurred. Try again';
      setMessage({ error, success: null });
    }
  };

  return (
    <PageLayout
      className="d-flex align-items-center flex-direction-column"
      siteTitle="Reset Password"
    >
      {message.success ? (
        <div className="pb-5 text-center">
          <BsCheckCircleFill size={60} color="green" />
          <h1 className="mt-2">Password changed successfully</h1>
          <div className="mt-1 mb-2">Please login with your new password.</div>
          <Button type="primary" onClick={() => navigate(paths.login)}>
            Login
          </Button>
        </div>
      ) : (
        <div className={styles.resetContainer}>
          <h1>Reset Password</h1>
          <div className="mb-2">Enter a new password to reset your password</div>
          {message.error && (
            <Alert type="error" message={message.error} className="width-100" closable />
          )}
          <FormWrapper form={form} onFinish={handleSubmit}>
            <PasswordField
              name="newPassword"
              label="New password"
              placeholder="Enter new password"
              value={newPassword}
              rules={[
                { required: true },
                { min: 6, message: 'Password must be greater than 6 characters' }
              ]}
              onChange={handleOnChange}
            />
            <PasswordField
              name="confirmPassword"
              label="Confirm new password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              rules={[{ validator: checkConfirmNewPassword }]}
              onChange={handleOnChange}
            />
            <Button
              type="primary"
              size="large"
              className="mt-2"
              block
              htmlType="submit"
              loading={isLoading}
            >
              Reset Password
            </Button>
          </FormWrapper>
        </div>
      )}
    </PageLayout>
  );
};

export default ResetPassword;
