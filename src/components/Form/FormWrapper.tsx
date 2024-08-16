import React, { ReactNode } from 'react';
import { Form, FormProps } from 'antd';

interface FormWrapperProps extends FormProps {
  children: ReactNode | ReactNode[];
}

export const FormWrapper = ({ children, layout = 'vertical', ...props }: FormWrapperProps) => (
  <Form layout={layout} {...props}>
    {children}
  </Form>
);
