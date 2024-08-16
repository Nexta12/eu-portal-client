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

const NewCategory = () => {
  const [form] = Form.useForm();
  const [categoryTitle, setCategoryTitle] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const { trigger, isMutating } = useSWRMutation(endpoints.createCategory, async (url) => {
    const res = await apiClient.post(url, { title: categoryTitle });
    return res.data;
  });

  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({ error: null, success: 'Category created successfully' });
      form.resetFields();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  return (
    <DashboardContentLayout
      title="Create Category"
      description="Create a new blog Category by filling the form"
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
          <h2>Create Category</h2>
          <FormWrapper
            className="d-flex flex-direction-column"
            onFinish={handleOnFinish}
            form={form}
          >
            <div className="d-flex gap-2">
              <InputField
                name="title"
                label="Title of Category"
                placeholder="Eg: Educational"
                rules={[{ required: true }]}
                value={categoryTitle}
                onChange={(e) => setCategoryTitle(e.target.value)}
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
              Create Category
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default NewCategory;
