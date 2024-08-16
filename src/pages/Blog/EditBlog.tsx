import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Form, Upload } from 'antd';
import DOMPurify from 'dompurify';
import useSWR from 'swr';
import { UploadOutlined } from '@ant-design/icons';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField, SelectField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { TextEditor } from '@components/TextEditor';
import { Blog, Category } from '@customTypes/blogs';
import { AlertMessage, SuccessResponse } from '@customTypes/general';
import styles from '@pages/Staff/Programmes/Programmes.module.scss';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import useSWRMutation from 'swr/mutation';

const EditBlog: React.FC = () => {
  const [form] = Form.useForm();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [blogDescription, setBlogDescription] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch blog data
  const { data: blog } = useSWR(`${endpoints.getBlogs}/${slug}`, async (url: string) => {
    const response = await apiClient.get<SuccessResponse<Blog>>(url);
    return response.data.data;
  });

  useEffect(() => {
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        category: blog.category.title,
        content: blog.content
      });
      setBlogTitle(blog.title);
      setBlogDescription(blog.content || '');
      setSelectedCategory(blog.category.title);
      if (blog.blogImage) {
        setFileList([{ uid: '-1', name: 'Image', status: 'done', url: blog.blogImage }]);
      }
    }
  }, [blog, form]);

  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.editBlog}/${slug}`,
    async (url: string) => {
      const formData = new FormData();
      formData.append('title', blogTitle);
      formData.append('category', selectedCategory || '');
      formData.append('content', DOMPurify.sanitize(blogDescription, { ALLOWED_TAGS: [] }));

      if (fileList.length > 0) {
        formData.append('file', fileList[0].originFileObj as RcFile);
      }

      const res = await apiClient.put<SuccessResponse<Blog>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data.data;
    }
  );

  const handleOnFinish = async () => {
    try {
      const updatedBlog = await trigger();
      setMessage({ success: 'Blog updated successfully', error: null });

      // Navigate to the new URL if the slug has changed
      if (updatedBlog?.slug && updatedBlog.slug !== slug) {
        navigate(`/dashboard/edit-blog/${updatedBlog.slug}`);
      }
    } catch (error) {
      const axiosError = getAxiosError(error);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  const { data: categories } = useSWR(endpoints.getCategories, async (url: string) => {
    const response = await apiClient.get<Category[]>(url);
    return response.data;
  });

  const categoryOptions = useMemo(
    () =>
      categories?.map(({ id, title: categoryTitle }) => ({
        value: categoryTitle.trim(),
        label: categoryTitle,
        key: id
      })) || [],
    [categories]
  );

  const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  return (
    <DashboardContentLayout title="Edit Blog" description="Edit an existing Blog">
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
          <FormWrapper
            className="d-flex flex-direction-column"
            onFinish={handleOnFinish}
            form={form}
          >
            <div className={styles.grid}>
              <InputField
                name="title"
                label="Title of Blog"
                placeholder="Enter your blog title"
                rules={[{ required: true }]}
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
              />
              <SelectField
                options={categoryOptions}
                label="Select Category"
                name="category"
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                rules={[{ required: true }]}
              />
            </div>
            <div className="d-flex flex-direction-column gap-2 mt-2">
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </div>
            <TextEditor
              placeholder="Write something..."
              label="Description"
              value={blogDescription}
              onChange={setBlogDescription}
            />
            <Button
              type="primary"
              size="large"
              className="mt-2"
              block
              htmlType="submit"
              loading={isMutating}
            >
              Update Blog
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default EditBlog;
