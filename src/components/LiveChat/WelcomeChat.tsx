import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'antd';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField } from '@components/Form';
import { AlertMessage } from '@customTypes/general';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { setLocalStorageItem } from '@utils/localStorage';
import { Socket, io } from 'socket.io-client';
import useSWRMutation from 'swr/mutation';
import styles from './LiveChat.module.scss';


const WelcomeChat = () => {
  const [form] = Form.useForm();
  const [chatterName, setChatterName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const socketInstance = io('ws://185.170.196.112/:4000');
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  const { trigger, isMutating } = useSWRMutation(endpoints.joinChat, async (url) => {
    const res = await apiClient.post(url, { email: userEmail, name: chatterName, welcomeMessage });
    return res.data;
  });

  const handleOnFinish = async () => {
    try {
      if (!socket?.connected) {
        setMessage({ error: 'Backend Server is not connected', success: null });
        return;
      }
      const response = await trigger();
      setMessage({ error: null, success: 'Joined Chat, Please wait for available admin' });
      form.resetFields();
      const details = response.data;
      const user = {
        name: details.name,
        email: details.email,
        role: details.role,
        userId: details.userId
      };

      setLocalStorageItem('chatUser', JSON.stringify(user));
      setLocalStorageItem('token', response.token);
      socket?.emit('getUnreadChats');
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  return (
    <div className={styles.chatMiddle}>
      <FormWrapper className="d-flex flex-direction-column" onFinish={handleOnFinish} form={form}>
        {(message.success || message.error) && (
          <Alert
            type={message.error ? 'error' : 'success'}
            message={message.error ?? message.success}
            className="width-100"
            closable
            onClose={() => setMessage({ error: null, success: null })}
          />
        )}
        <InputField
          name="name"
          label="Name"
          placeholder="Enter your name"
          rules={[{ required: true }]}
          value={chatterName}
          onChange={(e) => setChatterName(e.target.value)}
        />
        <InputField
          name="email"
          label="Email"
          placeholder="Enter your email"
          rules={[{ required: true }]}
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <textarea
          placeholder="Enter Message"
          onChange={(e) => setWelcomeMessage(e.target.value)}
          required
        />
        <Button
          type="primary"
          size="large"
          className="mt-2"
          block
          htmlType="submit"
          loading={isMutating}
        >
          Join Chat
        </Button>
      </FormWrapper>
    </div>
  );
};

export default WelcomeChat;