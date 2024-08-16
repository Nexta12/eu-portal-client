import React from 'react';
import { Form, Radio, RadioProps, Space } from 'antd';
import { FormOption } from '@customTypes/general';

interface RadioFieldProps extends RadioProps {
  label?: string;
  name?: string;
  options: FormOption[];
  direction?: 'vertical' | 'horizontal';
}

export const RadioField = ({
  label: radioLabel,
  options,
  onChange,
  direction = 'horizontal',
  value: radioValue,
  className,
  name,
  ...props
}: RadioFieldProps) => (
  <Form.Item label={radioLabel} className={className}>
    <Radio.Group onChange={onChange} className="mt-1" value={radioValue} name={name}>
      <Space direction={direction}>
        {options.map(({ label, value }, index) => (
          <Radio value={value} key={`${label}${index}`} {...props}>
            {label}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  </Form.Item>
);
