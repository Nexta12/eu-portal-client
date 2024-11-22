import React, { ChangeEvent, useEffect, useState } from 'react';
import { Alert, Button, Form } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { AlertMessage, SuccessResponse } from '@customTypes/general';
import { StudentProfile } from '@customTypes/user';
import useAuthStore from '@store/authStore';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { setLocalStorageItem } from '@utils/localStorage';
import useSWRMutation from 'swr/mutation';
import styles from './Edit.module.scss';
import EditContactInfo from './EditContactInfo';
import EditPersonalInfo from './EditPersonalInfo';

const Edit = () => {
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const userId = user?.userId;
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const { data } = useSWR(`${endpoints.students}/${userId}`, async (url: string) => {
    const response = await apiClient.get<SuccessResponse<StudentProfile>>(url);
    return response.data.data;
  });

  const defaultValues: Partial<StudentProfile> = {
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    phoneNumber: data?.phoneNumber,
    middleName: data?.middleName,
    gender: data?.gender,
    dateOfBirth: data?.dateOfBirth,
    employmentStatus: data?.employmentStatus,
    country: data?.country,
    nationality: data?.nationality,
    city: data?.city,
    cohort: data?.cohort,
    address: data?.address,
    zipCode: data?.zipCode
  };

  const [updateStudent, setUpdateStudent] = React.useState<StudentProfile>(
    defaultValues as StudentProfile
  );

  const { trigger, isMutating: loading } = useSWRMutation(
    `${endpoints.students}/update/${userId}`,
    async (url: string) => {
      const response = await apiClient.put(url, updateStudent);
      return response.data;
    }
  );

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setUpdateStudent({ ...updateStudent, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await trigger();
      const { email, firstName, lastName, admissionStatus, role, userId: myId } = response.data;
      setLocalStorageItem(
        'user',
        JSON.stringify({ email, firstName, lastName, role, admissionStatus, userId: myId })
      );
      setMessage({ error: null, success: 'Account has been updated successfully' });
    } catch (err) {
      const { errorData } = getAxiosError(err);
      setMessage({ error: formatErrors(errorData), success: null });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setUpdateStudent(data as StudentProfile);
  }, [data]);

  useEffect(() => {
    form.setFieldsValue(updateStudent);
  }, [form, updateStudent]);

  return (
    <DashboardContentLayout title="Edit Profile">
      <div className="d-flex flex-direction-column gap-2">
        {(message.success || message.error) && (
          <Alert
            type={message.error ? 'error' : 'success'}
            message={message.error ?? message.success}
            className="width-100 mb-2"
            closable
            onClose={() => setMessage({ error: null, success: null })}
          />
        )}
        <FormWrapper form={form} onFinish={handleSubmit} className={styles.form}>
          <EditPersonalInfo
            firstName={updateStudent?.firstName}
            lastName={updateStudent?.lastName}
            middleName={updateStudent?.middleName}
            employmentStatus={updateStudent?.employmentStatus as string}
            onChange={onChange}
            onSelectChange={(name: string, value: string) =>
              setUpdateStudent({ ...updateStudent, [name]: value })
            }
          />
          <EditContactInfo
            address={updateStudent?.address}
            country={updateStudent?.country}
            city={updateStudent?.city}
            zipCode={updateStudent?.zipCode?.toString()}
            nationality={updateStudent?.nationality as string}
            phoneNumber={updateStudent?.phoneNumber}
            onChange={onChange}
            handleOnSelect={(name: string, value: string) =>
              setUpdateStudent({ ...updateStudent, [name]: value })
            }
          />
          <Button
            type="primary"
            size="large"
            className={styles.actionButton}
            block
            htmlType="submit"
            loading={loading}
          >
            Save Application
          </Button>
        </FormWrapper>
      </div>
    </DashboardContentLayout>
  );
};

export default Edit;
