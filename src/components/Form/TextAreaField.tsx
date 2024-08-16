import React from 'react';
import { Form, FormRule, Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';

const { TextArea } = Input;

type TextAreaFieldProps = {
  label?: string;
  placeholder?: string;
  rows?: number;
  name?: string;
  rules?: FormRule[];
  error?: string;
} & TextAreaProps;

export const TextAreaField = ({
  label,
  rows = 4,
  name,
  rules,
  error,
  placeholder,
  className,
  ...props
}: TextAreaFieldProps) => (
  <div className="width-100">
    <Form.Item label={label} rules={rules} className={className}>
      <>
        <TextArea rows={rows} placeholder={placeholder} name={name} {...props} />
        {error && <div className="text-color-error font-small">{error}</div>}
      </>
    </Form.Item>
  </div>
);
