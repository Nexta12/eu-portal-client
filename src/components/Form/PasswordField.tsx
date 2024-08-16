import React from 'react';
import { Form, Input } from 'antd';
import styles from '@components/Form/FormField.module.scss';
import { InputFieldProps } from './InputField';

export const PasswordField = ({ name, label, rules, error, ...props }: InputFieldProps) => (
  <div className="width-100">
    <Form.Item label={label} name={name} rules={rules}>
      <>
        <Input.Password name={name} {...props} className={styles.inputField} />
        {error && <div className="text-color-error font-small">{error}</div>}
      </>
    </Form.Item>
  </div>
);
