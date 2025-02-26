import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Form, Upload } from 'antd';
import useSWR from 'swr';
import { UploadOutlined } from '@ant-design/icons';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { AlertMessage, SuccessResponse } from '@customTypes/general';
import { StaffProfile } from '@customTypes/user';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import type { UploadFile } from 'antd/es/upload/interface';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import useSWRMutation from 'swr/mutation';
import EditAcedmic from './EditAcademicInfo';
import EditBasicProfileInfo from './EditBasicInfo';

const EditStaffProfile = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  // Fetch current user
  const { data } = useSWR(`${endpoints.staffs}/${params.userId}`, async (link: string) => {
    const response = await apiClient.get<SuccessResponse<StaffProfile>>(link);
    return response.data.data;
  });

  // Utility function to generate default values
  const getDefaultValues = (profile: StaffProfile | undefined): Partial<StaffProfile> => ({
    firstName: profile?.firstName ?? '',
    middleName: profile?.middleName ?? '',
    lastName: profile?.lastName ?? '',
    description: profile?.description ?? '',
    quote: profile?.quote ?? '',
    contributions: profile?.contributions ?? '',
    location: profile?.location ?? '',
    portfolio: profile?.portfolio ?? '',
    department: profile?.department ?? '',
    qualification: profile?.qualification ?? '',
    certifications: profile?.certifications ?? '',
    profilePicture: profile?.profilePicture ?? ''
  });

  // Inside the component, use the existing `data`:
  const defaultValues = getDefaultValues(data);

  const [updateStaff, setUpdateStaff] = React.useState<StaffProfile>(defaultValues as StaffProfile);

  const { trigger, isMutating: loading } = useSWRMutation(
    `${endpoints.staffUpdate}/${params.userId}`,
    async (url: string, { arg }: { arg: FormData }) => {
      const response = await apiClient.put(url, arg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
  );

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setUpdateStaff({ ...updateStaff, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Add all form fields
      Object.entries(updateStaff).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      // Append the file if it exists
      if (fileList.length > 0) {
        formData.append('file', fileList[0].originFileObj as RcFile);
      }

      await trigger(formData); // Pass FormData as `arg`
      setMessage({ error: null, success: 'Updated Successfully' });
      setFileList([]);
    } catch (err) {
      const { errorData } = getAxiosError(err);
      setMessage({ error: formatErrors(errorData), success: null });
    } finally {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };
  const handleFileChange = ({ fileList: newFileList }: UploadChangeParam<UploadFile>) => {
    setFileList(newFileList.slice(-1));
  };

  useEffect(() => {
    if (data) {
      setUpdateStaff(data as StaffProfile);
    }
  }, [data]);

  useEffect(() => {
    form.setFieldsValue(updateStaff);
  }, [form, updateStaff]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContentLayout title="Update Profile">
      <div>
        {(message.success || message.error) && (
          <Alert
            type={message.error ? 'error' : 'success'}
            message={message.error ?? message.success}
            className="width-100"
            closable
            onClose={() => setMessage({ error: null, success: null })}
          />
        )}
        <FormWrapper className="d-flex flex-direction-column" form={form} onFinish={handleSubmit}>
          <div className="d-flex flex-direction-column gap-2 m-2">
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false} // Prevent immediate upload
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Profile Picture</Button>
            </Upload>
          </div>
          <EditBasicProfileInfo
            firstName={updateStaff.firstName}
            lastName={updateStaff.lastName}
            middleName={updateStaff.middleName}
            portfolio={updateStaff.portfolio}
            department={updateStaff.department}
            quote={updateStaff.quote}
            location={updateStaff.location}
            onChange={onChange}
          />
          <EditAcedmic
            description={updateStaff.description}
            qualification={updateStaff.qualification}
            contributions={updateStaff.contributions}
            certifications={updateStaff.certifications}
            onChange={onChange}
          />

          <Button
            type="primary"
            size="large"
            className="mt-2"
            block
            htmlType="submit"
            loading={loading}
          >
            Save
          </Button>
        </FormWrapper>
      </div>
    </DashboardContentLayout>
  );
};

export default EditStaffProfile;
