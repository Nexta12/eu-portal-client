import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Form } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { Faculty, Programme } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import ProgrammeForm, { parseCohorts } from '@pages/Staff/Programmes/ProgrammeForm';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import useSWRMutation from 'swr/mutation';

const EditProgramme = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [cohort, setCohort] = useState<CheckboxValueType[]>([]);
  const [programme, setProgramme] = useState<Programme>({} as Programme);
  const { data } = useSWR(`${endpoints.programmes}/${params.id}`, async (url: string) => {
    const response = await apiClient.get<Programme>(url);
    return response.data;
  });
  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.updateProgramme}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.put(url, programme);
      return response.data;
    }
  );

  useEffect(() => {
    if (data) {
      const facultyId = (data.faculty as Faculty)?.id;
      const currentCohorts = [
        data.isCertificate && 'certificate',
        data.isDiploma && 'diploma',
        data.isDegree && 'degree',
        data.isPostgraduate && 'postgraduate'
      ];
      form.setFieldsValue({ ...data, faculty: facultyId });
      setProgramme({ ...data, faculty: facultyId });
      setCohort(currentCohorts);
    }
  }, [data, form]);

  const handleCheckboxChange = (value: CheckboxValueType[]) => {
    setCohort(value);
    const cohorts = parseCohorts(value as string[]);
    setProgramme({ ...programme, ...cohorts });
  };

  const handleSubmitProgramme = async () => {
    try {
      await trigger();
      setMessage({ error: null, success: 'Programme updated successfully' });
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (err) {
      const { errorData } = getAxiosError(err);
      setMessage({ error: formatErrors(errorData), success: null });
    }
  };

  return (
    <DashboardContentLayout
      title="Edit Programme"
      description="Complete the form to edit a programme"
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
        name={programme?.name}
        code={programme?.code}
        description={programme?.description}
        durationInMonths={programme?.durationInMonths}
        cohort={cohort}
        isMutating={isMutating}
        overview={programme?.overview}
        objectives={programme?.objectives}
        entryRequirements={programme?.entryRequirements}
        faculty={programme?.faculty as string}
        form={form}
        handleChange={(event) => {
          const { name, value } = event.target;
          setProgramme({ ...programme, [name]: value });
        }}
        handleCheckboxChange={handleCheckboxChange}
        handleSubmitProgramme={handleSubmitProgramme}
        handleOnSelect={(name, value) => setProgramme({ ...programme, [name]: value })}
        submitText="Edit Programme"
      />
    </DashboardContentLayout>
  );
};

export default EditProgramme;
