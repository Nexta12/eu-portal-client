import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Card, Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DatePickerField, FormWrapper, InputField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { TextEditor } from '@components/TextEditor';
import { Event } from '@customTypes/events';
import { AlertMessage, SuccessResponse } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';
import styles from './Event.module.scss';

const EditEvent: React.FC = () => {
  const [form] = Form.useForm();
  const params = useParams<{ id: string }>();
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventFocus, setEventFocus] = useState<string>('');
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [eventDescription, setEventDescription] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const { data: event } = useSWR(`${endpoints.getEvents}/${params.id}`, async (url: string) => {
    const response = await apiClient.get<SuccessResponse<Event>>(url);
    return response.data.data;
  });

  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.editEvent}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.put(url, {
        title: eventTitle,
        focus: eventFocus,
        eventDate: eventDate ? eventDate.format('YYYY-MM-DD') : null,
        description: eventDescription
      });
      return response.data.data;
    }
  );

  const handleOnFinish = async () => {
    try {
      await trigger();
      setMessage({ success: 'Activity updated successfully', error: null });
    } catch (error) {
      const axiosError = getAxiosError(error);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  const onDateChange = (date: Dayjs | null) => {
    setEventDate(date);
  };

  useEffect(() => {
    if (event) {
      setEventTitle(event.title);
      setEventFocus(event.focus);
      setEventDate(dayjs(event.eventDate));
      setEventDescription(event.description);
      form.setFieldsValue({
        title: event.title,
        focus: event.focus,
        eventDate: dayjs(event.eventDate),
        description: event.description
      });
    }
  }, [event, form]);

  return (
    <DashboardContentLayout title="Edit activity" description="Edit an activity by filling the form">
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
          <h2>Edit Event</h2>
          <FormWrapper
            className="d-flex flex-direction-column"
            onFinish={handleOnFinish}
            form={form}
          >
            <div className={styles.threeRowGrid}>
              <InputField
                name="title"
                label="Title of Activity"
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
                placeholder=" Date of activity"
                label="Date of activity"
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
              Update Activity
            </Button>
          </FormWrapper>
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default EditEvent;
