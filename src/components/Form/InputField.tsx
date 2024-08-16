import React from 'react';
import { Form, FormRule, Input, InputProps } from 'antd';
import styles from './FormField.module.scss';

export type InputFieldProps = {
  name?: string;
  label?: string;
  rules?: FormRule[];
  error?: string;
} & InputProps;

export const InputField = ({ name, label, rules, error, ...props }: InputFieldProps) => (
  <div className="width-100">
    <Form.Item label={label} name={name} rules={rules}>
      <>
        <Input name={name} className={styles.inputField} {...props} />
        {error && <div className="text-color-error font-small">{error}</div>}
      </>
    </Form.Item>
  </div>
);
