import React, { useEffect, useState } from 'react';
import { Alert, Card, Form } from 'antd';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { Course, Level, Semester } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import { Cohort } from '@customTypes/user';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';
import { CourseForm } from './CourseForm';

export const defaultNewCourse = {
  name: '',
  code: '',
  unit: 0,
  costUsd: 0,
  description: '',
  cohort: Cohort.CERTIFICATE,
  level: Level.ONE_HUNDRED_LEVEL,
  programme: '',
  semester: Semester.FIRST,
  isCompulsory: false
};

const NewCourse = () => {
  const [form] = Form.useForm();
  const [values, setValues] = React.useState<Omit<Course, 'id'>>(defaultNewCourse);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const { isMutating, trigger } = useSWRMutation(endpoints.createCourse, async (link) => {
    const response = await apiClient.post(link, values);
    return response.data;
  });

  useEffect(() => {
    form.setFieldsValue({
      cohort: Cohort.CERTIFICATE,
      level: Level.ONE_HUNDRED_LEVEL,
      semester: Semester.FIRST
    });
  }, [form, values]);

  const handleCreateCourse = async () => {
    try {
      await trigger();
      setMessage({ error: null, success: 'Course Created Successfully' });
      form.resetFields();
    } catch (err) {
      const { errorData } = getAxiosError(err);
      setMessage({ error: formatErrors(errorData), success: null });
    }
  };

  return (
    <DashboardContentLayout
      title="Create new course"
      description="Create a new course by filling the form below"
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
          <h2>Course Details</h2>
          <CourseForm
            name={values.name}
            code={values.code}
            isCompulsory={values.isCompulsory}
            cohort={values.cohort}
            level={values.level}
            programme={values.programme as string}
            semester={values.semester}
            unit={values.unit}
            costUsd={values.costUsd}
            description={values.description}
            handleChange={(event) => {
              const { name, value } = event.target;
              setValues({ ...values, [name]: value });
            }}
            handleOnSelect={(name, value) => setValues({ ...values, [name]: value })}
            handleRadioChange={(event) =>
              setValues({ ...values, isCompulsory: event.target.value })
            }
            onFinish={handleCreateCourse}
            form={form}
            submitText="Create course"
            isMutating={isMutating}
          />
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default NewCourse;
