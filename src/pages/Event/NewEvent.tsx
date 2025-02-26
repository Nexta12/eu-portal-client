import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import DOMPurify from 'dompurify';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DatePickerField, FormWrapper, InputField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { TextEditor } from '@components/TextEditor';
import { AlertMessage } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';
import styles from './Event.module.scss';

const NewEvent: React.FC = () => {
  const [form] = Form.useForm();
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventFocus, setEventFocus] = useState<string>('');
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [eventDescription, setEventDescription] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const { trigger, isMutating } = useSWRMutation(endpoints.createEvent, async (url) => {
    const res = await apiClient.post(url, {
      title: eventTitle,
      focus: eventFocus,
      eventDate: eventDate ? eventDate.format('YYYY-MM-DD') : null,
      description: DOMPurify.sanitize(eventDescription, { ALLOWED_TAGS: [] })
    });
    return res.data;
  });

  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({ error: null, success: 'Activity created successfully' });
      setEventTitle('');
      setEventFocus('');
      setEventDate(null);
      setEventDescription('');
      form.resetFields();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  const onDateChange = (date: dayjs.Dayjs | null) => {
    setEventDate(date);
  };

  return (
    <DashboardContentLayout title="Create Activity" description="Create a new upcoming activity">
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
            <div className={styles.threeRowGrid}>
              <InputField
                name="title"
                label="Activity Title"
                placeholder="Eg: Matriculation!!!"
                rules={[{ required: true }]}
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <InputField
                name="focus"
                label="Activity focus"
                placeholder="Eg: Talkshow"
                value={eventFocus}
                onChange={(e) => setEventFocus(e.target.value)}
              />
              <DatePickerField
                placeholder="Date of Activity"
                label="Date of Activity"
                name="eventDate"
                value={eventDate}
                onChange={onDateChange}
                rules={[{ required: true }]}
              />
            </div>
            <TextEditor
              placeholder="Write something..."
              label="Description"
              value={eventDescription}
              onChange={setEventDescription}
            />
            <Button
              type="primary"
              size="large"
              className="mt-2"
              block
              htmlType="submit"
              loading={isMutating}
            >
              Create Activity
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default NewEvent;
