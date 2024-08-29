import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Card, Form } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField, SelectField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { AlertMessage } from '@customTypes/general';
import { StudentProfile, UserRole } from '@customTypes/user';
import { formatErrors } from '@utils/errorFormatter';
import { roleOptions } from '@utils/helpers';
import { HttpErrorStatusCode, getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';

type StaffDetailsType = Pick<StudentProfile, 'firstName' | 'lastName' | 'email' | 'role'>;
const defaultValues: StaffDetailsType = {
  firstName: '',
  lastName: '',
  email: '',
  role: UserRole.staff
};

const EditStaff = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const [values, setValues] = React.useState<StaffDetailsType>(defaultValues);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const { data, mutate } = useSWR(`${endpoints.staffs}/${params.userId}`, async (link: string) => {
    const response = await apiClient.get(link);
    return response.data.data;
  });

  const { trigger: update, isMutating } = useSWRMutation(
    `${endpoints.staffUpdate}/${params.userId}`,
    async (url: string) => {
      const response = await apiClient.put(url, values);
      return response.data;
    }
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleOnSelect = (name: string, value: string) => {
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    if (data) {
      setValues(data);
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const handleUpdate = async () => {
    try {
      await update();
      setMessage({ error: null, success: 'Staff Updated Successfully' });
      await mutate();
    } catch (err) {
      const { errorData, statusCode } = getAxiosError(err);
      const error =
        statusCode === HttpErrorStatusCode.INTERNAL_SERVER_ERROR
          ? 'An error occurred. Try again'
          : formatErrors(errorData);
      setMessage({ error, success: null });
    }
    form.resetFields();
  };

  return (
    <DashboardContentLayout
      title="Edit Staff"
      description="Edit this staff, by completing the form"
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
          <h2>Edit Staff</h2>
          <FormWrapper
            className="d-flex flex-direction-column"
            form={form}
            onFinish={handleUpdate}
            initialValues={data}
          >
            <div className="d-flex gap-2 flex-sm-column">
              <InputField
                name="firstName"
                label="First Name"
                placeholder="First Name"
                value={values.firstName}
                onChange={handleChange}
              />
              <InputField
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                value={values.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex gap-2 flex-sm-column">
              <InputField
                label="Email"
                name="email"
                placeholder="Staff email"
                value={values.email}
                onChange={handleChange}
                disabled
              />
              <SelectField
                options={roleOptions}
                label="Role"
                name="role"
                value={values.role}
                onSelect={(value) => handleOnSelect('role', value)}
              />
            </div>
            <Button
              type="primary"
              size="large"
              className="mt-2"
              block
              htmlType="submit"
              loading={isMutating}
            >
              Save
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default EditStaff;
