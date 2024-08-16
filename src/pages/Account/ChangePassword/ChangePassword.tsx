/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useState } from 'react';
import { Alert, Button, Form } from 'antd';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, PasswordField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { AlertMessage } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { RuleObject } from 'rc-field-form/lib/interface';
import styles from './changePassword.module.scss';

type ChangePasswordDetails = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const defaultValues: ChangePasswordDetails = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
};

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState<ChangePasswordDetails>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const validateConfirmPassword = (_: RuleObject, value: string) => {
    const { newPassword } = form.getFieldsValue();
    if (value && newPassword !== value) {
      return Promise.reject(new Error('Passwords do not match'));
    }
    return Promise.resolve();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiClient.put(endpoints.changePassword, formValue);
      setMessage({ error: null, success: 'Password has been updated' });
      setFormValue(defaultValues);
      form.resetFields();
      setLoading(false);
    } catch (err) {
      const { errorData } = getAxiosError(err);
      setMessage({ error: formatErrors(errorData), success: null });
      setLoading(false);
    }
  };

  const passwordRules: any[] = [
    { required: true },
    { min: 6, message: 'Password must be greater than 6 characters' }
  ];

  return (
    <DashboardContentLayout title="Change your password">
      <div className={styles.changePassword}>
        <div className={styles.header}>
          <strong>ACCOUNT INFORMATION</strong>
        </div>
        <div className="d-flex flex-direction-column gap-2 p-2 align-items-center">
          {message.error && (
            <Alert type="error" message={message.error} className="width-100" closable />
          )}
          {message.success && (
            <Alert type="success" message={message.success} className="width-100" closable />
          )}
          <FormWrapper
            className="d-flex flex-direction-column width-100"
            form={form}
            onFinish={handleSubmit}
          >
            <PasswordField
              name="currentPassword"
              label="Current Password"
              placeholder="Enter your current password"
              className="mt-1"
              value={formValue.currentPassword}
              onChange={handleOnChange}
              rules={passwordRules}
            />
            <PasswordField
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              className="mt-1"
              value={formValue.newPassword}
              onChange={handleOnChange}
              rules={passwordRules}
            />
            <PasswordField
              name="confirmNewPassword"
              label="Confirm New Password"
              placeholder="Confirm new password"
              className="mt-1"
              value={formValue.confirmNewPassword}
              onChange={handleOnChange}
              rules={[{ validator: validateConfirmPassword }]}
            />
            <Button
              type="primary"
              size="large"
              className="mt-2 align-self-center"
              htmlType="submit"
              loading={loading}
              block
            >
              Submit
            </Button>
          </FormWrapper>
        </div>
      </div>
    </DashboardContentLayout>
  );
};

export default ChangePassword;
