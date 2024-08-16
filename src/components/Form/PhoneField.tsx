import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Form, FormRule, InputProps } from 'antd';
import styles from './PhoneField.module.scss';

export type PhoneFieldProps = {
  name?: string;
  label?: string;
  rules?: FormRule[];
  error?: string;
  value: string;
  autofocus?: boolean;
  onChange: (formattedValue: string) => void;
  placeholder?: string;
  inputLabel?: string;
  required?: boolean;
} & InputProps;

export const PhoneField = ({
  name,
  label,
  rules,
  error,
  value,
  onChange,
  placeholder = 'Phone Number',
  inputLabel = 'Phone Number',
  required = true,
  ...props
}: PhoneFieldProps) => (
  <div className="width-100">
    <Form.Item label={label} name={name} rules={rules}>
      <PhoneInput
        inputProps={{
          name: 'phoneNumber',
          required,
          placeholder,
          label: inputLabel,
          id: 'phone',
          ...props
        }}
        inputStyle={{
          height: '100%',
          width: '100%'
        }}
        containerStyle={{
          height: '50px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        containerClass={styles.input}
        country="ng"
        value={value}
        onChange={onChange}
        inputClass={styles.input}
      />
      {error && <div className="text-color-error font-small">{error}</div>}
    </Form.Item>
  </div>
);
