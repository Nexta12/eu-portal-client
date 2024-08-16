import React, { useMemo } from 'react';
import { Button } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import {
  CheckboxField,
  FormWrapper,
  InputField,
  SelectField,
  TextAreaField
} from '@components/Form';
import { TextEditor } from '@components/TextEditor';
import { Faculty } from '@customTypes/courses';
import { Cohort } from '@customTypes/user';
import styles from '@pages/Staff/Programmes/Programmes.module.scss';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

export const parseCohorts = (cohorts: string[]) => {
  const cohortObj = {
    isCertificate: false,
    isDiploma: false,
    isDegree: false,
    isPostgraduate: false
  };

  cohorts.forEach((cohort) => {
    // eslint-disable-next-line default-case
    switch (cohort) {
      case 'certificate': {
        cohortObj.isCertificate = true;
        break;
      }
      case 'diploma': {
        cohortObj.isDiploma = true;
        break;
      }
      case 'degree': {
        cohortObj.isDegree = true;
        break;
      }
      case 'postgraduate': {
        cohortObj.isPostgraduate = true;
        break;
      }
      // No default
    }
  });

  return cohortObj;
};

const cohortOptions = [
  { label: 'Certificate', value: Cohort.CERTIFICATE },
  { label: 'Diploma', value: Cohort.DIPLOMA },
  { label: 'Degree', value: Cohort.DEGREE },
  { label: 'Postgraduate', value: Cohort.POSTGRADUATE }
];

const durationOptions = [
  { value: 1, label: '1 Months' },
  { value: 2, label: '2 Months' },
  { value: 3, label: '3 Months' },
  { value: 6, label: '6 Months' },
  { value: 9, label: '9 Months' },
  { value: 12, label: '12 Months' },
  { value: 18, label: '18 Months' },
  { value: 24, label: '24 Months' },
  { value: 48, label: '48 Months' }
];

interface ProgrammeFormProps {
  name?: string;
  code?: string;
  faculty?: string | Faculty;
  description?: string;
  entryRequirements?: string;
  objectives?: string;
  durationInMonths?: number;
  cohort?: CheckboxValueType[];
  isMutating?: boolean;
  overview?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (checkedValues: CheckboxValueType[]) => void;
  handleSubmitProgramme: () => void;
  handleOnSelect: (name: string, value: string) => void;
  submitText: string;
}

const ProgrammeForm = ({
  name,
  form,
  handleChange,
  durationInMonths,
  faculty,
  entryRequirements,
  objectives,
  overview,
  cohort,
  description,
  code,
  handleCheckboxChange,
  isMutating,
  handleSubmitProgramme,
  handleOnSelect,
  submitText
}: ProgrammeFormProps) => {
  const { data: faculties } = useSWR(endpoints.getFaculties, async (url: string) => {
    const response = await apiClient.get<Faculty[]>(url);
    return response.data;
  });

  const facultyOptions = useMemo(
    () =>
      faculties?.map(({ id = '', name: facultyName = '' }) => ({
        value: id,
        label: facultyName
      })) || [],
    [faculties]
  );

  return (
    <FormWrapper form={form}>
      <div className={styles.grid}>
        <InputField
          placeholder="Name"
          label="Name"
          name="name"
          value={name}
          onChange={handleChange}
          rules={[{ required: true }]}
        />
        <InputField
          placeholder="Programme code"
          label="Programme Code"
          name="code"
          value={code}
          onChange={handleChange}
          rules={[{ required: true }]}
        />
      </div>
      <div className={styles.grid}>
        <SelectField
          options={facultyOptions}
          label="Faculty"
          name="faculty"
          value={faculty}
          onSelect={(value) => handleOnSelect('faculty', value)}
          rules={[{ required: true }]}
        />
        <SelectField
          options={durationOptions}
          label="Duration (Months)"
          value={durationInMonths}
          name="durationInMonths"
          onSelect={(value) => handleOnSelect('durationInMonths', value)}
          rules={[{ required: true }]}
        />
      </div>
      <div className={styles.grid}>
        <CheckboxField
          options={cohortOptions}
          label="Cohort"
          value={cohort}
          onChange={handleCheckboxChange}
          rules={[{ required: true }]}
        />
        <TextAreaField
          label="Description"
          name="description"
          placeholder="Programme description"
          value={description}
          onChange={handleChange}
          rules={[{ required: true }]}
        />
      </div>
      <div className={styles.grid}>
        <TextAreaField
          label="Entry Requirements"
          name="entryRequirements"
          placeholder="Entry Requirements"
          value={entryRequirements}
          onChange={handleChange}
        />
        <TextAreaField
          label="Objectives"
          name="objectives"
          placeholder="Objectives"
          value={objectives}
          onChange={handleChange}
        />
      </div>
      <TextEditor
        placeholder="Write something..."
        label="Overview"
        value={overview}
        onChange={(text) => handleOnSelect('overview', text)}
      />
      <Button
        size="large"
        className="mt-2"
        type="primary"
        block
        onClick={handleSubmitProgramme}
        loading={isMutating}
      >
        {submitText}
      </Button>
    </FormWrapper>
  );
};

export default ProgrammeForm;
