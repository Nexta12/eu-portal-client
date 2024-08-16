import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Card, Form } from 'antd';
import DOMPurify from 'dompurify';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField, SelectField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { TextEditor } from '@components/TextEditor';
import { AlertMessage, SuccessResponse } from '@customTypes/general';
import { Notifications } from '@customTypes/notifications';
import styles from '@pages/Staff/Programmes/Programmes.module.scss';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';

const levelOptions = [
  { label: 'info', value: 'info', key: 'info' },
  { label: 'warning', value: 'warning', key: 'warning' }
];

const EditNotification = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const [notificationTitle, setNotificationTitle] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [notificationMessage, setnotificationMessage] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const { data: notification } = useSWR(
    `${endpoints.getNotifications}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.get<SuccessResponse<Notifications>>(url);
      return response.data.data;
    }
  );

  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.editNotification}/${params.id}`,
    async (url: string) => {
      const res = await apiClient.put(url, {
        title: notificationTitle,
        level: selectedLevel,
        message: DOMPurify.sanitize(notificationMessage, { ALLOWED_TAGS: [] })
      });
      return res.data;
    }
  );

  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({ success: 'Broadcast updated successfully', error: null });
    } catch (error) {
      const axiosError = getAxiosError(error);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };
  useEffect(() => {
    if (notification) {
      setNotificationTitle(notification.title);
      setnotificationMessage(notification.message);
      setSelectedLevel(notification.level);
      form.setFieldsValue({
        title: notification.title,
        message: notification.message,
        level: notification.level
      });
    }
  }, [notification, form]);

  return (
    <DashboardContentLayout title="Edit Broadcast Message" description="">
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
                label="Title of Message"
                placeholder="Eg: New Resumption Date"
                rules={[{ required: true }]}
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
              />
              <SelectField
                options={levelOptions}
                label="Severity"
                name="level"
                value={selectedLevel}
                onChange={(value) => setSelectedLevel(value)}
                rules={[{ required: true }]}
              />
            </div>
            <TextEditor
              placeholder="Write something..."
              label="Message"
              value={notificationMessage}
              onChange={setnotificationMessage}
            />
            <Button
              type="primary"
              size="large"
              className="mt-2"
              block
              htmlType="submit"
              loading={isMutating}
            >
              Update Broadcast Message
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default EditNotification;
