import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'antd';
import DOMPurify from 'dompurify';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField, SelectField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { TextEditor } from '@components/TextEditor';
import { AlertMessage } from '@customTypes/general';
import styles from '@pages/Staff/Programmes/Programmes.module.scss';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';

const levelOptions = [
  { label: 'info', value: 'info', key: 'info' },
  { label: 'warning', value: 'warning', key: 'warning' }
];

const NewNotification = () => {
  const [form] = Form.useForm();
  const [notificationTitle, setNotificationTitle] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const { trigger, isMutating } = useSWRMutation(
    endpoints.createNotification,
    async (url: string) => {
      const res = await apiClient.post(url, {
        title: notificationTitle,
        message: DOMPurify.sanitize(notificationMessage, { ALLOWED_TAGS: [] }),
        level: selectedLevel
      });
      return res.data;
    }
  );
  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({ error: null, success: 'Broadcast Message created successfully' });
      setNotificationTitle('');
      setNotificationMessage('');
      setSelectedLevel('');
      form.resetFields();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };
  return (
    <DashboardContentLayout
      title="Create Broadcast Message"
      description="This Places a Notice to all students dashboard"
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
              onChange={setNotificationMessage}
            />
            <Button
              type="primary"
              size="large"
              className="mt-2"
              block
              htmlType="submit"
              loading={isMutating}
            >
              Send Broadcast Message
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};
export default NewNotification;
