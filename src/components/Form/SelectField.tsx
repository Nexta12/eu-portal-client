import React from 'react';
import { Form, FormRule, Select, SelectProps } from 'antd';
import { FormOption } from '@customTypes/general';
import styles from './FormField.module.scss';

type SelectFieldProps = {
  defaultValue?: string | number | null;
  label?: string;
  name?: string;
  options: FormOption[];
  rules?: FormRule[];
  error?: string | null;
} & SelectProps;

export const SelectField = ({
  defaultValue,
  options,
  name,
  label: formLabel,
  rules,
  error,
  ...props
}: SelectFieldProps) => (
  <div className="width-100">
    <Form.Item label={formLabel} name={name} rules={rules}>
      <>
        <Select
          options={options}
          className={styles.selectField}
          showSearch
          filterOption={(input, option) => {
            const optionLabel = option?.label; // Rename the `label` variable to avoid shadowing
            return (
              typeof optionLabel === 'string' &&
              optionLabel.toLowerCase().includes(input.toLowerCase())
            );
          }}
          {...props}
        />
        {error && <div className="text-color-error font-small">{error}</div>}
      </>
    </Form.Item>
  </div>
);
