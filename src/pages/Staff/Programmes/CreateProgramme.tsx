import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Form } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { Faculty, Programme } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import useSWRMutation from 'swr/mutation';
import ProgrammeForm, { parseCohorts } from './ProgrammeForm';

const defaultValues: Partial<Programme> = {
  name: '',
  code: '',
  faculty: '',
  description: '',
  entryRequirements: '',
  objectives: '',
  durationInMonths: 1,
  overview: '',
  isCertificate: false,
  isDiploma: false,
  isDegree: false,
  isPostgraduate: false
};

const CreateProgramme = () => {
  const [newProgramme, setNewProgramme] = useState<Programme>(defaultValues as Programme);
  const [cohort, setCohort] = useState<CheckboxValueType[]>([]);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [form] = Form.useForm();
  const { data: faculties } = useSWR(endpoints.getFaculties, async (url: string) => {
    const response = await apiClient.get<Faculty[]>(url);
    return response.data;
  });
  const { trigger, isMutating } = useSWRMutation(endpoints.createProgramme, async (url) => {
    const response = await apiClient.post(url, newProgramme);
    return response.data;
  });

  const facultyOptions = useMemo(
    () =>
      faculties?.map((faculty) => ({
        value: faculty.id || '',
        label: faculty.name || ''
      })) || [],
    [faculties]
  );

  useEffect(() => {
    form.setFieldsValue({
      ...defaultValues,
      faculty: facultyOptions.length > 0 && facultyOptions[0]
    });

    if (facultyOptions.length > 0) {
      setNewProgramme((prevProgramme) => ({
        ...prevProgramme,
        faculty: facultyOptions[0].value
      }));
    }
  }, [facultyOptions, form]);

  const handleCheckboxChange = (value: CheckboxValueType[]) => {
    setCohort(value);
    const cohorts = parseCohorts(value as string[]);
    setNewProgramme({ ...newProgramme, ...cohorts });
  };

  const handleSubmitProgramme = async () => {
    try {
      await trigger();
      setMessage({ error: null, success: 'Programme created successfully' });
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setNewProgramme(defaultValues as Programme);
      form.resetFields();
    } catch (err) {
      const { errorData } = getAxiosError(err);
      setMessage({ error: formatErrors(errorData), success: null });
    }
  };

  return (
    <DashboardContentLayout
      title="Create Programme"
      description="Complete the form to create a programme"
    >
      {(message.success || message.error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      <ProgrammeForm
        name={newProgramme.name}
        code={newProgramme.code}
        faculty={newProgramme?.faculty}
        description={newProgramme.description}
        entryRequirements={newProgramme.entryRequirements}
        objectives={newProgramme.objectives}
        durationInMonths={newProgramme.durationInMonths}
        cohort={cohort}
        isMutating={isMutating}
        overview={newProgramme?.overview}
        form={form}
        handleChange={(event) => {
          const { name, value } = event.target;
          setNewProgramme({ ...newProgramme, [name]: value });
        }}
        handleCheckboxChange={handleCheckboxChange}
        handleOnSelect={(name, value) => setNewProgramme({ ...newProgramme, [name]: value })}
        submitText="Create Programme"
        handleSubmitProgramme={handleSubmitProgramme}
      />
    </DashboardContentLayout>
  );
};

export default CreateProgramme;
