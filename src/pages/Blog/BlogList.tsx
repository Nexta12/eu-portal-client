import React, { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { Alert, Button } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { CustomModal } from '@components/Modal';
import { AntTable } from '@components/Table';
import { Blog, MappedBlog } from '@customTypes/blogs';
import { AlertMessage } from '@customTypes/general';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { capitalizeWords, formatDate } from '@utils/helpers';
import { getAxiosError } from '@utils/http';
import { ColumnsType } from 'antd/es/table';
import defaultImage from './noImage.png';

const Column: ColumnsType<MappedBlog> = [
  {
    title: 'S/No',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'Blog Image',
    dataIndex: 'blogImage',
    key: 'blogImage',
    render: (text) => (
      <img src={text || defaultImage} alt="Blog" style={{ width: '100px', height: 'auto' }} />
    ) //
  },
  {
    title: 'Blog Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Created By',
    dataIndex: 'author',
    key: 'author'
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const BlogList = () => {
  const navigate = useNavigate();
  const {
    data: blogs,
    isLoading,
    error,
    mutate
  } = useSWR(endpoints.getBlogs, async (url) => {
    const response = await apiClient.get<Blog[]>(url);
    return response.data;
  });

  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleDeleteBlog = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteBlog}/${id}`);
      setMessage({ error: null, success: 'Blog deleted successfully' });
      await mutate();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const blogList: MappedBlog[] =
    blogs?.map(({ id, slug, blogImage, title, author, createdAt }, index) => ({
      key: id,
      sn: index + 1,
      blogImage,
      title,
      author: capitalizeWords(`${author?.firstName} ${author?.lastName}`),
      createdAt: createdAt ? formatDate(createdAt) : '',
      content: '', // Assuming content is optional in MappedBlog
      actions: (
        <div className="d-flex align-items-center gap-1">
          <Button onClick={() => navigate(`${paths.editBlog}/${slug}`)}>Edit</Button>
          <Button
            onClick={() => {
              setOpenConfirmationModal(true);
              setIsDeleting(id);
            }}
          >
            <LuTrash2 size={20} color={colorPrimary} />
          </Button>
        </div>
      )
    })) || [];

  return (
    <DashboardContentLayout
      title="List of Blogs"
      description="List of all published blogs on the portal"
    >
      {(message.success || message.error || error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      <AntTable columns={Column} dataSource={blogList} loading={isLoading} />
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={async () => {
          setOpenConfirmationModal(false);
          await handleDeleteBlog(isDeleting);
        }}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
      >
        <div>Are you sure you want to delete this blog?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default BlogList;
