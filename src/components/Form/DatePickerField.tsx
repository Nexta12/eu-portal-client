import React from 'react';
import { DatePicker, DatePickerProps, Form, FormRule } from 'antd';
import styles from './FormField.module.scss';

type DatePickerFieldProps = {
  name?: string;
  label?: string;
  rules?: FormRule[];
} & DatePickerProps;

export const DatePickerField = ({
  label,
  name,
  rules,
  format = 'DD/MM/YYYY',
  ...props
}: DatePickerFieldProps) => (
  <div className="width-100">
    <Form.Item label={label} name={name} rules={rules}>
      <DatePicker name={name} className={styles.datePicker} format={format} {...props} />
    </Form.Item>
  </div>
);
