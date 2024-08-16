import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Card, Form } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { Faculty } from '@customTypes/courses';
import { AlertMessage, SuccessResponse } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';

const NewFaculty = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const [facultyName, setFacultyName] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const { data: faculty } = useSWR(
    `${endpoints.getFaculties}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.get<SuccessResponse<Faculty>>(url);
      return response.data.data;
    }
  );

  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.updateFaculty}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.put(url, { name: facultyName });
      return response.data.data;
    }
  );

  const onFinish = async () => {
    try {
      await trigger();
      setMessage({ success: 'Faculty updated successfully', error: null });
    } catch (error) {
      const axiosError = getAxiosError(error);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  useEffect(() => {
    if (faculty) {
      setFacultyName(faculty.name);
      form.setFieldsValue({ name: faculty.name });
    }
  }, [faculty, form]);

  return (
    <DashboardContentLayout
      title="Edit Faculty"
      description="Edit faculty info by filling this form"
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
          <h2>Create Faculty</h2>
          <FormWrapper className="d-flex flex-direction-column" form={form} onFinish={onFinish}>
            <div className="d-flex gap-2">
              <InputField
                name="name"
                label="Name of Faculty"
                placeholder="Name of Faculty"
                rules={[{ required: true }]}
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
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
              Update Faculty
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default NewFaculty;
