import React, { ChangeEvent } from 'react';
import { InputField } from '@components/Form';
import { StaffProfile } from '@customTypes/user';
import styles from './Profile.module.scss';

type EditBasicInfo = Pick<
  StaffProfile,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'portfolio'
  | 'department'
  | 'location'
  | 'quote'
  // | 'phoneNumber'
  // | 'address'
>;

interface EditBasicInfoProps extends EditBasicInfo {
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EditBasicProfileInfo: React.FC<EditBasicInfoProps> = ({
  firstName,
  middleName,
  lastName,
  portfolio,
  department,
  location,
  // phoneNumber,
  // address,
  quote,
  onChange
}) => (
  <>
    <div className={styles.threeRowGrid}>
      <InputField
        name="firstName"
        label="First Name"
        placeholder="First Name"
        value={firstName}
        onChange={onChange}
      />
      <InputField
        label="Middle Name"
        name="middleName"
        placeholder="Middle name"
        value={middleName}
        onChange={onChange}
      />
      <InputField
        name="lastName"
        label="Last Name"
        placeholder="Last Name"
        value={lastName}
        onChange={onChange}
      />
    </div>
    {/* <div className={styles.twoRowGrid}>
      <InputField
        name="phoneNumber"
        label="Phone"
        placeholder=""
        value={phoneNumber}
        onChange={onChange}
      />
      <InputField
        label="Address"
        name="address"
        placeholder=""
        value={address}
        onChange={onChange}
      />
    </div> */}
    <div className={styles.threeRowGrid}>
      <InputField
        name="portfolio"
        label="Portfolio"
        placeholder="e.g. Head of Admin"
        value={portfolio}
        onChange={onChange}
      />
      <InputField
        label="Department"
        name="department"
        placeholder="e.g. Accounts"
        value={department}
        onChange={onChange}
      />
      <InputField
        name="location"
        label="Location"
        placeholder="Location"
        value={location}
        onChange={onChange}
      />
    </div>
    <InputField
      name="quote"
      label="Give us a Quote"
      placeholder="Every today well spent, makes tomorrow a vision of hope!"
      value={quote}
      onChange={onChange}
    />
  </>
);

export default EditBasicProfileInfo;
