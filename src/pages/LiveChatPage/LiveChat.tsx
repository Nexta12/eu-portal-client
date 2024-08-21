import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { Alert, Badge, Button, Form } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { CustomModal } from '@components/Modal';
import { AlertMessage, SuccessResponse } from '@customTypes/general';
import { Livechat } from '@customTypes/livechat';
import useChatMessages from '@hooks/useChatMessages';
import { authStore } from '@store/index';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { formatDate } from '@utils/helpers';
import { getAxiosError } from '@utils/http';
import { useSocket } from '@hooks/useSocket';
import useSWRMutation from 'swr/mutation';
import userImage from '../Blog/user-img.png';
import styles from './Chat.module.scss';

interface CurrentUser {
  userId: string;
  socketId: string;
}
interface TypingStatus {
  message: string;
  chatHistory: string;
}

const LiveChat = () => {
  const socket = useSocket();
  const [form] = Form.useForm();
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [selectedChat, setSelectedChat] = useState<Livechat | null>(null);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<TypingStatus | null>(null);
  const [chatReadStatus, setChatReadStatus] = useState<{ [key: string]: boolean }>({});
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set<string>());
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = authStore();

  const { data: chatsHistoryResponse } = useSWR<SuccessResponse<Livechat[]>>(
    `${endpoints.getAllChatsHistory}`,
    async (url: string) => {
      const response = await apiClient.get<SuccessResponse<Livechat[]>>(url);
      return response.data;
    }
  );

  const chatsHistory = useMemo(() => chatsHistoryResponse?.data || [], [chatsHistoryResponse]);

  useEffect(() => {
    if (chatsHistory.length > 0) {
      setSelectedChat(chatsHistory[0]);
    }
  }, [chatsHistory]);

  const { chatMessages, isLoading, isError, mutate } = useChatMessages(selectedChat?.id || null);

  const handleChatClick = (chat: Livechat) => {
    setSelectedChat(chat);
  };

  const { trigger, isMutating } = useSWRMutation(
    `${endpoints.sendChat}/${selectedChat?.id}`,
    async (url: string) => {
      const res = await apiClient.post(url, { message: chatMessage });
      return res.data;
    },
    {
      onSuccess: () => {
        mutate();
        setChatMessage('');
        form.resetFields();
        if (socket && selectedChat?.id) {
          socket.emit('sendChatterIsTyping', {
            message: '',
            chatHistory: selectedChat.id
          });
        }
      }
    }
  );

  const handleOnFinish = async () => {
    try {
      await trigger();
      socket?.emit('sendAdminMessage', { chatMessage, chatId: selectedChat?.id });
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOnFinish();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages]);

  const handleSocketMessage = useCallback(
    (data: { chatHistory: string }) => {
      if (selectedChat?.id === data.chatHistory) {
        mutate();
      }
    },
    [selectedChat, mutate]
  );

  const cleanupSocket = useCallback(() => {
    if (socket) {
      socket.off('getChatterMessage', handleSocketMessage);
    }
  }, [socket, handleSocketMessage]);

  useEffect(() => {
    if (socket) {
      socket.on('getChatterMessage', handleSocketMessage);
    }
    return cleanupSocket;
  }, [socket, handleSocketMessage, cleanupSocket]);

  useEffect(() => {
    if (socket) {
      socket.on('chatterIsTyping', (data: TypingStatus) => {
        if (selectedChat?.id === data.chatHistory) {
          setIsTyping(data);
        }
      });
    }
    return () => {
      socket?.off('chatterIsTyping');
    };
  }, [socket, selectedChat]);

  const handleFocus = () => {
    const firstName = user?.firstName ?? '';
    const lastName = user?.lastName ?? '';
    const typingMessage = `${firstName} ${lastName} is typing...`;

    socket?.emit('sendAdminIsTyping', {
      message: typingMessage,
      chatHistory: selectedChat?.id
    });
  };

  const handleBlur = () => {
    socket?.emit('sendAdminIsTyping', {
      message: '',
      chatHistory: selectedChat?.id
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on('getOnlineUsers', (liveUsers: CurrentUser[]) => {
        const onlineUserIds = new Set(liveUsers.map((liveuser) => liveuser.userId));
        setOnlineUsers(onlineUserIds);
      });
    }
    return () => {
      socket?.off('getOnlineUsers');
    };
  }, [socket]);

  useEffect(() => {
    if (selectedChat) {
      socket?.emit('chatIsOpened', { chatHistory: selectedChat.id });
      setChatReadStatus((prev) => ({ ...prev, [selectedChat.id]: true }));
      socket?.emit('getUnreadChats');
    }
  }, [selectedChat, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('messageRead', (chatId: string) => {
        setChatReadStatus((prev) => ({ ...prev, [chatId]: true }));
      });
    }
    return () => {
      socket?.off('messageRead');
    };
  }, [socket]);

  useEffect(() => {
    if (chatsHistory.length > 0) {
      const initialReadStatus: { [key: string]: boolean } = {};

      chatsHistory.forEach((chat) => {
        initialReadStatus[chat.id] = false;
      });

      setChatReadStatus(initialReadStatus);
      setSelectedChat(chatsHistory[0]);
    }
  }, [chatsHistory]);

  const handleDeleteChat = async (id: string) => {
    try {
      setIsDeleting(id);
      await apiClient.delete(`${endpoints.deleteChats}/${id}`);
      setMessage({ error: null, success: 'Chat deleted successfully' });
      await mutate();
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
    setIsDeleting('');
    window.location.reload();
  };

  return (
    <DashboardContentLayout>
      <div className={styles.chatMainBox}>
        <div className={styles.leftSide}>
          <ul>
            {chatsHistory.map((chat) => (
              <div className={styles.chatHistoryLi}>
                <button
                  key={chat.id}
                  onClick={() => handleChatClick(chat)}
                  className={`${styles.chatItem} ${
                    selectedChat?.id === chat.id ? styles.selected : ''
                  }`}
                  aria-label={`Chat with ${chat.chatUser?.name}`}
                >
                  <div className={styles.imageWrapper}>
                    <img src={userImage} alt="userIcon" />
                    <Badge
                      className={`${styles.badge} ${
                        onlineUsers.has(chat.chatUser?.userId ?? '')
                          ? styles.isOnline
                          : styles.isOffline
                      }`}
                    />
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>
                      {chat.chatUser?.name}
                      {!chatReadStatus[chat.id] && !chat.isRead && (
                        <Badge className={styles.unreadNotification} />
                      )}
                    </span>

                    <span className={styles.userEmail}>{chat.chatUser?.email}</span>
                  </div>
                </button>
                <Button
                  className={styles.deleteChatBtn}
                  onClick={() => {
                    setOpenConfirmationModal(true);
                    setIsDeleting(chat?.chatUser?.userId);
                  }}
                >
                  <LuTrash2 size={15} color={colorPrimary} title="Delete this user and chats" />
                </Button>
              </div>
            ))}
          </ul>
        </div>
        {chatsHistory.length > 0 ? (
          <div className={styles.rightSide}>
            <div className={styles.bigChatBox} ref={scrollRef}>
              {selectedChat ? (
                <>
                  <div className={styles.studentMsg}>
                    {selectedChat.message}
                    <div>{formatDate(selectedChat.createdAt)}</div>
                  </div>
                  {isLoading ? (
                    <p>Loading messages...</p>
                  ) : isError ? (
                    <p>Error loading messages</p>
                  ) : (
                    chatMessages?.map((msg: Livechat) => (
                      <div
                        key={msg.id}
                        className={`${msg.staff ? styles.adminMsg : styles.studentMsg}`}
                      >
                        {msg.message}
                        <div>{formatDate(msg.createdAt)}</div>
                      </div>
                    ))
                  )}
                  {isTyping && isTyping.chatHistory === selectedChat?.id && (
                    <p>{isTyping.message}</p>
                  )}
                </>
              ) : (
                <p>Select a chat to view conversations</p>
              )}
            </div>
            {selectedChat && (
              <FormWrapper onFinish={handleOnFinish} form={form}>
                {(message.success || message.error) && (
                  <Alert
                    type={message.error ? 'error' : 'success'}
                    message={message.error ?? message.success}
                    className="width-100"
                    closable
                    onClose={() => setMessage({ error: null, success: null })}
                  />
                )}
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
            )}
          </div>
        ) : (
          <div className={styles.emptyChatBox}>
            <p>Chats Can only be initiated from the homepage </p>
          </div>
        )}
      </div>
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={async () => {
          setOpenConfirmationModal(false);
          await handleDeleteChat(isDeleting);
        }}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
      >
        <div>Are you sure you want to delete all Chats this user ? </div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default LiveChat;
