import React, { ChangeEvent } from 'react';
import { InputField, SelectField } from '@components/Form';
import { EmploymentStatus } from '@customTypes/user';
import styles from './Edit.module.scss';

type EditPersonal = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  employmentStatus: string;
  onSelectChange: (name: string, value: string) => void;
};

const employmentOptions = [
  { label: EmploymentStatus?.EMPLOYED, value: EmploymentStatus?.EMPLOYED },
  { label: EmploymentStatus?.SELF_EMPLOYED, value: EmploymentStatus?.SELF_EMPLOYED },
  { label: EmploymentStatus?.UNEMPLOYED, value: EmploymentStatus?.UNEMPLOYED }
];

const EditPersonalInfo: React.FC<EditPersonal> = ({
  firstName,
  lastName,
  onChange,
  middleName,
  employmentStatus,
  onSelectChange
}) => (
  <div className={styles.personalInfo}>
    <div className={styles.heading}>
      <h2 className="mb-0">Personal Information</h2>
    </div>
    <div className={styles.threeRowGrid}>
      <InputField
        label="First Name"
        name="firstName"
        value={firstName}
        onChange={onChange}
        rules={[{ required: true }]}
      />
      <InputField
        label="Middle Name"
        name="middleName"
        value={middleName}
        onChange={onChange}
        rules={[{ required: true }]}
      />
      <InputField
        label="Last Name"
        name="lastName"
        value={lastName}
        onChange={onChange}
        rules={[{ required: true }]}
      />
      <SelectField
        options={employmentOptions}
        name="employmentStatus"
        value={employmentStatus}
        defaultValue={employmentStatus}
        onChange={(event: string) => onSelectChange('employmentStatus', event)}
        label="Employment Status"
        rules={[{ required: true }]}
      />
    </div>
  </div>
);

export default EditPersonalInfo;
