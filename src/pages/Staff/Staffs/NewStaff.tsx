import React, { ChangeEvent, useState } from 'react';
import { Alert, Button, Card, Form } from 'antd';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField, PasswordField, SelectField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { AlertMessage } from '@customTypes/general';
import { StudentProfile, UserRole } from '@customTypes/user';
import { formatErrors } from '@utils/errorFormatter';
import { roleOptions } from '@utils/helpers';
import { HttpErrorStatusCode, getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';

type NewStaffType = Pick<StudentProfile, 'firstName' | 'lastName' | 'email' | 'role'> & {
  password: string;
};

const defaultValues: NewStaffType = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: UserRole.staff
};

const NewStaff = () => {
  const [values, setValues] = React.useState<NewStaffType>(defaultValues);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [duplicateEmailError, setDuplicateEmailError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleOnSelect = (name: string, value: string) => {
    setValues({ ...values, [name]: value });
  };

  const { trigger, isMutating: isLoading } = useSWRMutation(endpoints.newStaff, async (link) => {
    const response = await apiClient.post(link, values);
    return response.data;
  });

  const validateDuplicateEmail = async () => {
    try {
      if (!values.email) return;
      await apiClient.get(`/auth/email/${values.email}`);
      setDuplicateEmailError(null);
    } catch (err) {
      const { statusCode } = getAxiosError(err);
      const errorMessage =
        statusCode === HttpErrorStatusCode.CONFLICT
          ? 'Email already exists'
          : 'Error occurred while validating email';
      setDuplicateEmailError(errorMessage);
    }
  };

  const handleSubmit = async () => {
    try {
      await trigger();
      setMessage({ error: null, success: 'Staff Created Successfully' });
      form.resetFields();
    } catch (err) {
      form.resetFields();
      const { errorData, statusCode } = getAxiosError(err);
      const error =
        statusCode === HttpErrorStatusCode.INTERNAL_SERVER_ERROR
          ? 'An error occurred. Try again'
          : formatErrors(errorData);
      setMessage({ error, success: null });
    }
  };

  return (
    <DashboardContentLayout
      title="Create new staff"
      description="Create a new staff by filling the form below"
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
          <h2>Staff Information</h2>
          <FormWrapper className="d-flex flex-direction-column" form={form} onFinish={handleSubmit}>
            <div className="d-flex gap-2 flex-sm-column">
              <InputField
                name="firstName"
                label="First Name"
                placeholder="First Name"
                value={values.firstName}
                onChange={handleChange}
                rules={[{ required: true }]}
              />
              <InputField
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                value={values.lastName}
                onChange={handleChange}
                rules={[{ required: true }]}
              />
            </div>
            <div className="d-flex gap-2 flex-sm-column">
              <InputField
                label="Email"
                name="email"
                placeholder="Staff email"
                value={values.email}
                onBlur={validateDuplicateEmail}
                onChange={handleChange}
                onFocus={() => setDuplicateEmailError(null)}
                error={duplicateEmailError || undefined}
                rules={[
                  { required: true },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              />
              <SelectField
                options={roleOptions}
                label="Role"
                name="role"
                value={values.role}
                onSelect={(value) => handleOnSelect('role', value)}
                rules={[{ required: true }]}
              />
              <PasswordField
                name="password"
                label="Password"
                placeholder="Enter staff password"
                value={values.password}
                onChange={handleChange}
              />
            </div>
            <Button
              type="primary"
              size="large"
              className="mt-2"
              block
              htmlType="submit"
              loading={isLoading}
            >
              Create Staff
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default NewStaff;
