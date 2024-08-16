import React from 'react';
import { Checkbox, CheckboxProps, Form, FormRule } from 'antd';
import { FormOption } from '@customTypes/general';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

const CheckboxGroup = Checkbox.Group;

interface CheckboxFieldProps extends Omit<CheckboxProps, 'onChange'> {
  label?: string;
  options: FormOption[];
  onChange: (list: CheckboxValueType[]) => void;
  rules?: FormRule[];
}

export const CheckboxField = ({
  label,
  options,
  className,
  value,
  onChange,
  rules,
  ...props
}: CheckboxFieldProps) => (
  <Form.Item label={label} className={className} rules={rules}>
    <CheckboxGroup options={options} value={value} onChange={onChange} {...props} />
  </Form.Item>
);
