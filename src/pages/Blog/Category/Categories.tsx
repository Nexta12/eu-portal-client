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
import { Category } from '@customTypes/blogs';
import { AlertMessage } from '@customTypes/general';
import { paths } from '@routes/paths';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { capitalizeWords, formatDate } from '@utils/helpers';
import { getAxiosError } from '@utils/http';
import { ColumnsType } from 'antd/es/table';

type CategoryType = Pick<Category, 'title' | 'createdAt'>;

const Column: ColumnsType<CategoryType> = [
  {
    title: 'S/No',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'Category Name',
    dataIndex: 'title',
    key: 'title'
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

const Categories = () => {
  const navigate = useNavigate();

  const {
    data: categories,
    isLoading,
    error,
    mutate
  } = useSWR(endpoints.getCategories, async (url) => {
    const response = await apiClient.get<Category[]>(url);
    return response.data;
  });
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleDeleteCategory = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteCategory}/${id}`);
      setMessage({ error: null, success: 'Category deleted successfully' });
      await mutate();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryList =
    categories?.map(({ id, title, createdAt }, index) => ({
      key: id,
      sn: index + 1,
      title: capitalizeWords(title),
      createdAt: createdAt ? formatDate(createdAt) : '',
      actions: (
        <div className="d-flex align-items-center gap-1">
          <Button onClick={() => navigate(`${paths.editCategory}/${id}`)}>Edit</Button>
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
      title="Blog Categories"
      description="List of all categories used for posting blogs"
    >
      <div className="d-flex justify-content-end m-2">
        <Button type="primary" size="large" onClick={() => navigate(paths.newCategory)}>
          Create new Category
        </Button>
      </div>
      {(message.success || message.error || error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      <AntTable columns={Column} dataSource={categoryList} loading={isLoading} />
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={async () => {
          setOpenConfirmationModal(false);
          await handleDeleteCategory(isDeleting);
        }}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
      >
        <div>Are you sure you want to delete this category?</div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default Categories;
