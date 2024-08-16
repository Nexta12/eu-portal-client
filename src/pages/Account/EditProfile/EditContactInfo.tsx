import React, { ChangeEvent } from 'react';
import { Col, Row } from 'antd';
import { InputField, SelectField, TextAreaField } from '@components/Form';
import { StudentProfile } from '@customTypes/user';
import { countries, nationalityList } from '@utils/data';
import { capitalize } from '@utils/letterFormatter';
import styles from './Edit.module.scss';

type EditContact = Pick<
  StudentProfile,
  'phoneNumber' | 'zipCode' | 'city' | 'country' | 'address' | 'nationality'
>;

interface EditContactInfoProps extends EditContact {
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOnSelect: (name: string, value: string) => void;
}

const EditContactInfo: React.FC<EditContactInfoProps> = ({
  phoneNumber,
  zipCode,
  city,
  country,
  address,
  nationality,
  onChange,
  handleOnSelect
}) => {
  const countryOptions = countries;
  const nationalityOptions = nationalityList.map((nation) => ({
    label: capitalize(nation),
    value: capitalize(nation)
  }));
  return (
    <div className={styles.editContact}>
      <div className={styles.heading}>
        <h2 className="mb-0">Contact Info</h2>
      </div>
      <div className="p-1">
        <Row gutter={[24, 24]}>
          <Col sm={24} lg={12}>
            <InputField
              label="Phone Number"
              name="phoneNumber"
              value={phoneNumber}
              onChange={onChange}
              rules={[{ required: true }]}
            />
          </Col>
          <Col sm={24} lg={12}>
            <SelectField
              label="Country of residence"
              options={countryOptions}
              name="country"
              value={country}
              onSelect={(value) => handleOnSelect('country', value)}
              rules={[{ required: true }]}
            />
          </Col>
          <Col sm={24} lg={12}>
            <InputField
              label="City"
              name="city"
              value={city}
              onChange={onChange}
              rules={[{ required: true }]}
            />
          </Col>
          <Col sm={24} lg={12}>
            <SelectField
              options={nationalityOptions}
              label="Nationality"
              value={nationality}
              name="nationality"
              onSelect={(value) => handleOnSelect('nationality', value)}
              rules={[{ required: true }]}
            />
          </Col>
          <Col lg={16} sm={24}>
            <TextAreaField
              label="Address"
              name="address"
              value={address}
              onChange={onChange}
              rows={4}
              cols={40}
            />
          </Col>
          <Col lg={8} sm={24}>
            <InputField
              label="Postal Code"
              name="zipCode"
              value={zipCode as string}
              onChange={onChange}
              rules={[{ required: true }]}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EditContactInfo;
