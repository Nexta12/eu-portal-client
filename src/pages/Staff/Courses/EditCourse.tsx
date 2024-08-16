import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Card, Form } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { Course } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';
import { CourseForm } from './CourseForm';

type CourseType = Omit<Course, 'id'>;

const EditCourse = () => {
  const [values, setValues] = useState<CourseType>({} as CourseType);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const params = useParams();
  const [form] = Form.useForm();

  const { data: courseToEdit, mutate } = useSWR(
    `${endpoints.getCourses}/${params.id}`,
    async (link: string) => {
      const response = await apiClient.get(link);
      return response.data;
    }
  );

  useEffect(() => {
    if (courseToEdit) {
      setValues({ ...courseToEdit, programme: courseToEdit.programme?.id });
      form.setFieldsValue({ ...courseToEdit, programme: courseToEdit.programme?.id });
    }
  }, [courseToEdit, form]);

  const { trigger: updateCourse, isMutating } = useSWRMutation(
    `${endpoints.editCourse}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.put(url, values);
      return response.data;
    }
  );

  const handleSubmit = async () => {
    try {
      await updateCourse();
      setMessage({ error: null, success: 'Course Updated Successfully' });
      await mutate();
    } catch (err) {
      const { errorData } = getAxiosError(err);
      setMessage({ error: formatErrors(errorData), success: null });
    }
    form.resetFields();
  };

  return (
    <DashboardContentLayout title="Edit course" description="Edit this course with the form below">
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
            onFinish={handleSubmit}
            form={form}
            submitText="Create course"
            isMutating={isMutating}
          />
        </Card>
      </div>
    </DashboardContentLayout>
  );
};

export default EditCourse;
