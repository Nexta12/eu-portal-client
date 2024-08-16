import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'antd';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { AlertMessage } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';

const NewFaculty = () => {
  const [form] = Form.useForm();
  const [facultyName, setFacultyName] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const { trigger, isMutating } = useSWRMutation(endpoints.createFaculty, async (url) => {
    const res = await apiClient.post(url, { name: facultyName });
    return res.data;
  });

  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({ error: null, success: 'Faculty created successfully' });
      form.resetFields();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  return (
    <DashboardContentLayout
      title="Create new faculty"
      description="Create a new faculty by filling the faculty name"
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
          <FormWrapper
            className="d-flex flex-direction-column"
            onFinish={handleOnFinish}
            form={form}
          >
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
              Create Faculty
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default NewFaculty;
