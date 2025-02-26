import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Card, Form } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { Category } from '@customTypes/blogs';
import { AlertMessage, SuccessResponse } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';

const EditCategory = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const [categoryTitle, setCategoryTitle] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const { data: category } = useSWR(
    `${endpoints.getCategories}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.get<SuccessResponse<Category>>(url);
      return response.data.data;
    }
  );

  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.editCategory}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.put(url, { title: categoryTitle });
      return response.data.data;
    }
  );

  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({ success: 'Category updated successfully', error: null });
    } catch (error) {
      const axiosError = getAxiosError(error);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  useEffect(() => {
    if (category) {
      setCategoryTitle(category.title);
      form.setFieldsValue({ title: category.title });
    }
  }, [category, form]);

  return (
    <DashboardContentLayout
      title="Edit Category"
      description="Edit a blog Category by filling the form"
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
          <h2>Edit Category</h2>
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
              Update Category
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default EditCategory;
