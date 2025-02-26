import React, { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import {
  DatePickerField,
  FormWrapper,
  InputField,
  PhoneField,
  SelectField,
  TextAreaField
} from '@components/Form';
import { Programme } from '@customTypes/courses';
import { Cohort, EmploymentStatus, Gender, StudentProfile, Titles } from '@customTypes/user';
import { ApplicationSteps } from '@pages/Admission/Apply/Apply';
import { paths } from '@routes/paths';
import { formatUSDollar } from '@utils/currencyFormatter';
import { countries, nationalityList } from '@utils/data';
import { HttpErrorStatusCode, getAxiosError } from '@utils/http';
import { capitalize } from '@utils/letterFormatter';
import useSWRMutation from 'swr/mutation';
import styles from './Apply.module.scss';

export const cohortOptions = [
  {
    label: 'Select One',
    value: '',
    disabled: true
  },
  {
    label: 'Certificate',
    value: Cohort.CERTIFICATE
  },
  {
    label: 'Diploma',
    value: Cohort.DIPLOMA
  },
  {
    label: 'Degree',
    value: Cohort.DEGREE
  },
  {
    label: 'Post Graduate/Graduate Studies',
    value: Cohort.POSTGRADUATE
  }
];

export const genderOptions = [
  { value: Gender.MALE, label: 'Male' },
  { value: Gender.FEMALE, label: 'Female' },
  { value: Gender.UNSPECIFIED, label: 'Unspecified' },
  { value: Gender.UNDISCLOSED, label: 'Undisclosed' }
];
export const titleOptions = [
  { value: Titles.MR, label: 'Mr.' },
  { value: Titles.Mrs, label: 'Mrs.' },
  { value: Titles.Master, label: 'Master.' },
  { value: Titles.Doctor, label: 'Dr.' },
  { value: Titles.Prof, label: 'Prof.' },
  { value: Titles.Engnr, label: 'Engnr.' }
];

const employmentStatusOptions = [
  { value: EmploymentStatus.UNEMPLOYED, label: 'Unemployed' },
  { value: EmploymentStatus.EMPLOYED, label: 'employed' },
  { value: EmploymentStatus.SELF_EMPLOYED, label: 'self-employed' }
];

const countryOptions = countries;
const nationalityOptions = nationalityList.map((nationality) => ({
  label: capitalize(nationality),
  value: capitalize(nationality)
}));

const defaultValues: Partial<StudentProfile> = {
  title: Titles.MR,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  middleName: '',
  gender: Gender.MALE,
  dateOfBirth: '',
  employmentStatus: EmploymentStatus.UNEMPLOYED,
  country: 'Nigeria',
  nationality: '',
  city: '',
  cohort: Cohort.CERTIFICATE,
  address: ''
};

interface ApplicationFormProps {
  setCurrentStep: Dispatch<SetStateAction<ApplicationSteps>>;
  setStudentEmail: Dispatch<SetStateAction<string>>;
}

const ApplicationForm = ({ setCurrentStep, setStudentEmail }: ApplicationFormProps) => {
  const [form] = Form.useForm();
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [newStudent, setNewStudent] = React.useState<StudentProfile>(
    defaultValues as StudentProfile
  );
  const [duplicateEmailError, setDuplicateEmailError] = React.useState<string | null>(null);
  const { trigger, isMutating: isSubmitting } = useSWRMutation('createStudent', async () => {
    const response = await apiClient.post(`${endpoints.students}/create`, newStudent);
    return response.data.data;
  });

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
      data?.map((programme) => ({
        label: programme.name,
        value: programme.id
      })),
    [data]
  );

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewStudent({ ...newStudent, [name]: value });
  };
  const handleOnSelect = (name: string, value: string) => {
    if (name === 'programme') {
      const selected = data?.find((programme) => programme.id === value);
      setSelectedProgramme(selected || null);
    }
    setNewStudent({ ...newStudent, [name]: value });
  };

  const onDateChange = (date: dayjs.Dayjs | null) => {
    setNewStudent({ ...newStudent, dateOfBirth: dayjs(date).format('YYYY-MM-DD') });
  };

  const handleTextAreaChange = (
    name: string,
    { target: { value } }: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewStudent({ ...newStudent, [name]: value });
  };

  const validateDuplicateEmail = async () => {
    try {
      if (!newStudent.email) return;

      await apiClient.get(`/auth/email/${newStudent.email}`);
      setDuplicateEmailError(null);
    } catch (err) {
      const { statusCode } = getAxiosError(err);
      const errorMessage =
        statusCode === HttpErrorStatusCode.CONFLICT
          ? 'Email already exists'
          : 'Error occurred while validating email';
      setDuplicateEmailError(errorMessage);
    }
  };

  const getFilteredCohortOptions = () => {
    if (!selectedProgramme) return cohortOptions;

    return cohortOptions.filter(
      (option) =>
        (option.value === Cohort.CERTIFICATE && selectedProgramme.isCertificate) ||
        (option.value === Cohort.DIPLOMA && selectedProgramme.isDiploma) ||
        (option.value === Cohort.DEGREE && selectedProgramme.isDegree) ||
        (option.value === Cohort.POSTGRADUATE && selectedProgramme.isPostgraduate)
    );
  };

  const handleSubmit = async () => {
    try {
      await trigger();
      setStudentEmail(newStudent.email);
      setCurrentStep(ApplicationSteps.SUCCESS);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch {
      setCurrentStep(ApplicationSteps.FAILURE);
    }
  };

  return (
    <div>
      <h1>Apply for Admission</h1>
      <div className="lh-md">
        Completing an application online is the quickest, easiest way to apply to eUniversity
        Africa. Keep in mind that while we accept general admissions applications on a rolling
        basis, there are deadlines for specific programs and we encourage you to apply early. If you
        have technical questions or concerns about the application process, please email us at
        admission@euniversityedu.africa. Please note that application fee of{' '}
        {formatUSDollar.format(20)} applies.
      </div>
      <FormWrapper
        form={form}
        onFinish={handleSubmit}
        className={styles.form}
        initialValues={defaultValues}
      >
        <div className={styles.threeRowGrid}>
          <SelectField
            options={titleOptions}
            label="Title"
            name="title"
            value={newStudent.title}
            defaultValue={newStudent.title}
            onSelect={(value) => handleOnSelect('title', value)}
          />
          <InputField
            placeholder="First Name"
            label="First Name"
            name="firstName"
            value={newStudent.firstName}
            onChange={onChange}
            rules={[{ required: true }]}
          />
          <InputField
            placeholder="Last Name"
            label="Last Name"
            name="lastName"
            value={newStudent.lastName}
            onChange={onChange}
            rules={[{ required: true }]}
          />
        </div>
        <div className={styles.threeRowGrid}>
          <SelectField
            options={genderOptions}
            label="Gender"
            name="gender"
            value={newStudent.gender}
            defaultValue={newStudent.gender}
            onSelect={(value) => handleOnSelect('gender', value)}
          />
          <InputField
            placeholder="Email"
            label="Email"
            name="email"
            value={newStudent.email}
            onBlur={validateDuplicateEmail}
            onFocus={() => setDuplicateEmailError(null)}
            onChange={onChange}
            error={duplicateEmailError || undefined}
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          />
          <PhoneField
            name="phoneNumber"
            label="Phone Number"
            value={newStudent.phoneNumber as string}
            onChange={(formattedValue) =>
              setNewStudent({ ...newStudent, phoneNumber: formattedValue as string })
            }
            rules={[{ required: true }]}
          />
        </div>
        <div className={styles.threeRowGrid}>
          <DatePickerField
            placeholder="Dob"
            label="Date of birth"
            name="dateOfBirth"
            onChange={(date) => onDateChange(date)}
            rules={[{ required: true }]}
          />
          <SelectField
            label="Country"
            options={countryOptions}
            name="country"
            value={newStudent.country}
            onSelect={(value) => handleOnSelect('country', value)}
            rules={[{ required: true }]}
          />
          <InputField
            placeholder="City"
            label="City"
            name="city"
            value={newStudent.city}
            onChange={onChange}
            rules={[{ required: true }]}
          />
        </div>
        <div className={styles.threeRowGrid}>
          <SelectField
            options={nationalityOptions}
            label="Nationality"
            name="nationality"
            value={newStudent.nationality}
            onSelect={(value) => handleOnSelect('nationality', value)}
            rules={[{ required: true }]}
          />
          <InputField
            placeholder="Zip Code/Postal Code"
            label="Zip Code/Postal Code"
            name="zipCode"
            value={newStudent.zipCode}
            onChange={onChange}
          />
          <SelectField
            options={employmentStatusOptions}
            label="Employment Status"
            name="employmentStatus"
            value={newStudent.employmentStatus}
            onSelect={(value) => handleOnSelect('employmentStatus', value)}
            rules={[{ required: true }]}
          />
        </div>
        <div className={styles.threeRowGrid}>
          <TextAreaField
            placeholder="Address"
            label="Address"
            name="address"
            value={newStudent.address}
            onChange={(event) => handleTextAreaChange('address', event)}
            rules={[{ required: true }]}
            rows={2}
          />
          <SelectField
            options={programmesOptions || []}
            label="Programme"
            loading={isLoading}
            error={isLoadingProgrammesError ? 'Error loading programmes' : null}
            name="programme"
            value={newStudent.programme}
            onSelect={(value) => handleOnSelect('programme', value)}
            rules={[{ required: true }]}
          />
          <SelectField
            options={getFilteredCohortOptions()}
            label="Cohort"
            name="cohort"
            value={newStudent.cohort}
            onSelect={(value) => handleOnSelect('cohort', value)}
            rules={[{ required: true }]}
          />
        </div>
        <div className="align-self-start font-small">
          By clicking apply, I agree to{' '}
          <Link to={paths.termsOfUse} target="_blank">
            Terms of Use
          </Link>{' '}
          and acknowledge that I have read the <Link to={paths.privacyPolicy}>Privacy Policy</Link>.
        </div>
        <Button
          disabled={!!duplicateEmailError}
          type="primary"
          size="large"
          className={styles.actionButton}
          block
          htmlType="submit"
          loading={isSubmitting}
        >
          Apply
        </Button>
      </FormWrapper>
    </div>
  );
};

export default ApplicationForm;
