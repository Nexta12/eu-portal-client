import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form } from 'antd';
import useSWR, { mutate } from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper } from '@components/Form';
import { SuccessResponse } from '@customTypes/general';
import { Livechat } from '@customTypes/livechat';
import { formatDate } from '@utils/helpers';
import { getLocalStorageItem } from '@utils/localStorage';
import { useSocket } from '@hooks/useSocket';
import useSWRMutation from 'swr/mutation';
import styles from './LiveChat.module.scss';

interface TypingStatus {
  message: string;
  chatHistory: string;
}

const MessengerBox = () => {
  const socket = useSocket();
  const [form] = Form.useForm();
  const [chatMessage, setChatMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<TypingStatus | null>(null);
  const chatUserJson = getLocalStorageItem('chatUser');
  const chatUser = chatUserJson ? JSON.parse(chatUserJson) : null;
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socket && chatUser?.userId) {
      socket.emit('addUser', chatUser.userId);
    }
  }, [chatUser, socket]);

  const { data: chatHistory } = useSWR<{ data: Livechat }>(
    `${endpoints.getOneUserChatHistory}/${chatUser?.userId}`,
    async (url: string) => {
      const response = await apiClient.get<{ data: Livechat }>(url);
      return response.data;
    }
  );

  const { data: chatConversations, mutate: mutateChatConversations } = useSWR(
    chatHistory ? `${endpoints.getAllChats}/${chatHistory.data.id}` : null,
    async (url: string) => {
      const response = await apiClient.get<SuccessResponse<Livechat[]>>(url);
      return response.data.data;
    }
  );

  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.sendChat}/${chatHistory?.data.id}`,
    async (url: string) => {
      const res = await apiClient.post(url, { message: chatMessage });
      return res.data;
    },
    {
      onSuccess: () => {
        if (chatHistory?.data.id) {
          mutate(`${endpoints.getAllChats}/${chatHistory?.data.id}`);
        }
        setChatMessage('');
        form.resetFields();
      }
    }
  );

  const handleOnFinish = async () => {
    await trigger();
    socket?.emit('sendChatterMessage', {
      chatMessage,
      chatHistory: chatHistory?.data.id,
      senderId: chatUser?.userId
    });
    socket?.emit('getUnreadChats');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    socket?.emit('sendChatterIsTyping', {
      message: `${chatUser?.name} is typing...`,
      chatHistory: chatHistory?.data.id
    });
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOnFinish();
    }
  };
  const handleFocus = () => {
    socket?.emit('sendChatterIsTyping', {
      message: `${chatUser?.name} is typing...`,
      chatHistory: chatHistory?.data.id
    });
  };
  const handleBlur = () => {
    socket?.emit('sendChatterIsTyping', {
      message: '',
      chatHistory: chatHistory?.data.id
    });
  };
  useEffect(() => {
    if (socket) {
      socket.on('adminIsTyping', (data: TypingStatus) => {
        if (chatHistory?.data.id === data.chatHistory) {
          setIsTyping(data);
        }
      });
    }
    return () => {
      socket?.off('adminIsTyping');
    };
  }, [socket, chatHistory?.data.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [chatConversations, chatMessage]);

  const handleSocketMessage = useCallback(
    (newMessage: Livechat) => {
      mutateChatConversations((prevConversations: Livechat[] | undefined) => {
        const conversations = prevConversations as Livechat[] | undefined;
        return conversations ? [...conversations, newMessage] : [newMessage];
      });
    },
    [mutateChatConversations]
  );

  useEffect(() => {
    if (socket) {
      socket.on('getAdminMessage', handleSocketMessage);
    }
    return () => {
      if (socket) {
        socket.off('getAdminMessage', handleSocketMessage);
      }
    };
  }, [socket, handleSocketMessage]);

  return (
    <div className={styles.rightSide}>
      <div className={styles.bigChatBox} ref={chatContainerRef}>
        <div className={styles.studentMsgHistory}>
          {chatHistory?.data.message}
          <div>
            {chatHistory?.data?.createdAt ? formatDate(new Date(chatHistory.data.createdAt)) : ''} |
            <span>{chatHistory?.data.chatUser?.name}</span>
          </div>
        </div>
        {chatConversations?.map((msg) => (
          <div className={`${msg.staff ? styles.studentMsg : styles.adminMsg}`} key={msg.id}>
            {msg.message}
            <div>{formatDate(msg.createdAt)}</div>
          </div>
        ))}
        {isTyping && isTyping.chatHistory === chatHistory?.data.id && <p>{isTyping.message}</p>}
      </div>
      <FormWrapper onFinish={handleOnFinish} form={form}>
        <div className={styles.messageForm}>
          <textarea
            placeholder="Enter Message"
            value={chatMessage}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <Button
            type="primary"
            size="large"
            className="mt-2"
            block
            htmlType="submit"
            loading={isMutating}
          >
            Send
          </Button>
        </div>
      </FormWrapper>
    </div>
  );
};

export default MessengerBox;
