import React, { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'antd';
import { FormWrapper, InputField, PasswordField } from '@components/Form';
import { PageLayout } from '@components/Layout';
import { paths } from '@routes/paths';
import useAuthStore from '@store/authStore';
import styles from './Login.module.scss';

export type LoginDetails = {
  email: string;
  password: string;
};

const Login = () => {
  const [form] = Form.useForm();
  const [values, setValues] = React.useState({ email: '', password: '' });
  const { login, error, isLoading, setError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const data: LoginDetails = {
      email: values.email,
      password: values.password
    };
    await login(data, navigate);
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    setError(null);
  };

  return (
    <PageLayout siteTitle="Login">
      <div className={styles.loginContainer}>
        <h1>Login</h1>
        <div className="mb-2">Enter your credentials to Login now</div>
        <FormWrapper onFinish={handleSubmit} form={form}>
          <InputField
            name="email"
            label="Email"
            placeholder="Enter your email address"
            value={values.email}
            onChange={handleOnChange}
            rules={[{ required: true }, { type: 'email', message: 'Please enter a valid email' }]}
          />
          <PasswordField
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={values.password}
            className="mt-1"
            onChange={handleOnChange}
            rules={[
              { required: true },
              { min: 6, message: 'Password must be greater than 6 characters' }
            ]}
          />
          <div className={styles.forgotPassword} onClick={() => navigate(paths.forgotPassword)}>
            Forgot password?
          </div>
          {error && <div className="text-color-error font-small">{error}</div>}
          <Button
            type="primary"
            size="large"
            className="mt-2"
            block
            htmlType="submit"
            loading={isLoading}
          >
            Login
          </Button>
        </FormWrapper>
      </div>
    </PageLayout>
  );
};

export default Login;
