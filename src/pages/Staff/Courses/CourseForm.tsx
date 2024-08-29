import React, { useEffect, useMemo } from 'react';
import { Button, FormInstance, RadioChangeEvent } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField, RadioField, SelectField, TextAreaField } from '@components/Form';
import { Level, Programme, Semester } from '@customTypes/courses';
import { cohortOptions } from '@pages/Admission/Apply/ApplicationForm';
import { RuleObject } from 'rc-field-form/lib/interface';

export const levelOptions = [
  {
    label: '100L',
    value: Level.ONE_HUNDRED_LEVEL
  },
  {
    label: '200L',
    value: Level.TWO_HUNDRED_LEVEL
  },
  {
    label: '300L',
    value: Level.THREE_HUNDRED_LEVEL
  },
  {
    label: '400L',
    value: Level.FOUR_HUNDRED_LEVEL
  },
  {
    label: '500L',
    value: Level.FIVE_HUNDRED_LEVEL
  }
];

export const semesterOptions = [
  {
    label: 'first',
    value: Semester.FIRST
  },
  {
    label: 'second',
    value: Semester.SECOND
  }
];

interface CourseFormProps {
  name?: string;
  code?: string;
  isCompulsory?: boolean;
  cohort?: string;
  level?: string;
  programme?: string;
  semester?: string;
  unit?: number;
  costUsd?: number;
  description?: string;
  isMutating?: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOnSelect: (name: string, value: string) => void;
  handleRadioChange?: (event: RadioChangeEvent) => void;
  onFinish: () => void;
  form: FormInstance<Programme>;
  submitText: string;
}

const validateNumber = (_: RuleObject, value: string) => {
  if (!/^-?\d*\.?\d+$/.test(value)) {
    return Promise.reject(new Error('Please enter a valid number'));
  }
  return Promise.resolve();
};

export const CourseForm = ({
  name,
  code,
  isCompulsory,
  cohort,
  level,
  programme,
  semester,
  unit,
  costUsd,
  description,
  isMutating,
  handleChange,
  handleOnSelect,
  handleRadioChange,
  form,
  onFinish,
  submitText
}: CourseFormProps) => {
  const {
    data,
    isLoading,
    error: isLoadingProgrammesError
  } = useSWR(endpoints.programmes, async (url) => {
    const response = await apiClient.get<Programme[]>(url);
    return response.data;
  });

  const programmesOptions = useMemo(
    () =>
      data?.map((currentProgramme) => ({
        label: currentProgramme.name || '',
        value: currentProgramme.id || ''
      })),
    [data]
  );

  useEffect(() => {
    const value = programmesOptions?.[0]?.value || '';
    form.setFieldValue('programme', value);
    // This is to ensure that the value is set in the state when user does not select a programme
    handleOnSelect('programme', value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, programmesOptions]);

  return (
    <FormWrapper className="d-flex flex-direction-column" form={form} onFinish={onFinish}>
      <div className="d-flex gap-2 flex-sm-column">
        <InputField
          name="name"
          label="Course Name"
          placeholder="Course Name"
          value={name}
          onChange={handleChange}
          rules={[{ required: true }]}
        />
        <InputField
          name="code"
          label="Course Code"
          placeholder="Course Code"
          value={code}
          onChange={handleChange}
          rules={[{ required: true }]}
        />
        <RadioField
          label="Compulsory?"
          name="isCompulsory"
          options={[
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]}
          value={isCompulsory}
          onChange={handleRadioChange}
        />
      </div>
      <div className="d-flex gap-2 flex-sm-column">
        <SelectField
          options={cohortOptions}
          label="Cohort"
          name="cohort"
          value={cohort}
          onSelect={(value) => handleOnSelect('cohort', value)}
          rules={[{ required: true }]}
        />
        <SelectField
          options={programmesOptions || []}
          label="Programme"
          name="programme"
          loading={isLoading}
          error={isLoadingProgrammesError ? 'Error loading programmes' : null}
          value={programme}
          onSelect={(value) => handleOnSelect('programme', value)}
          rules={[{ required: true }]}
        />
        <SelectField
          options={levelOptions}
          label="Level"
          name="level"
          value={level}
          onSelect={(value) => handleOnSelect('level', value)}
          rules={[{ required: true }]}
        />
      </div>
      <div className="d-flex gap-2 flex-sm-column">
        <SelectField
          options={semesterOptions}
          label="Semester"
          name="semester"
          value={semester}
          onSelect={(value) => handleOnSelect('semester', value)}
          rules={[{ required: true }]}
        />
        <InputField
          name="unit"
          label="Course Unit"
          placeholder="Course Unit"
          value={unit}
          onChange={handleChange}
          rules={[{ validator: validateNumber }]}
        />
        <InputField
          name="costUsd"
          label="Cost USD"
          placeholder="Cost USD"
          value={costUsd}
          onChange={handleChange}
          rules={[{ validator: validateNumber }]}
        />
      </div>
      <TextAreaField
        label="Description"
        name="description"
        value={description}
        onChange={handleChange}
      />
      <Button
        type="primary"
        size="large"
        className="mt-2"
        block
        htmlType="submit"
        loading={isMutating}
      >
        {submitText}
      </Button>
    </FormWrapper>
  );
};
