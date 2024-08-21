import React, { useEffect, useState } from 'react';
import { FiMinus } from 'react-icons/fi';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { PageLayout } from '@components/Layout';
import { getLocalStorageItem, removeLocalStorageItem } from '@utils/localStorage';
import styles from './LiveChat.module.scss';
import MessengerBox from './MessengerBox';
import WelcomeChat from './WelcomeChat';

let logoutTimeout: NodeJS.Timeout;
const LiveChat = () => {
  const [iconColor, setIconColor] = useState<string>('#fff');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isChatMinimized, setIsChatMinimized] = useState<boolean>(false);
  const chatUserJson = getLocalStorageItem('chatUser');
  const chatUser = chatUserJson ? JSON.parse(chatUserJson) : null;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIconColor('#960524');
      } else {
        setIconColor('#fff');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const toggleChatBox = () => {
    setIsChatOpen((prev) => !prev);
    setIsChatMinimized(false);
  };

  const minimizeChatBox = () => {
    setIsChatMinimized(true);
    setIsChatOpen(false);
  };

  useEffect(() => {
    logoutTimeout = setTimeout(() => {
      removeLocalStorageItem('chatUser');
      removeLocalStorageItem('token');
    }, 600_000); // 10 minutes

    return () => clearTimeout(logoutTimeout);
  }, []);

  return (
    <PageLayout>
      {!isChatOpen && !isChatMinimized && (
        <IoChatbubblesOutline
          className={styles.chatBubble}
          style={{ color: iconColor }}
          onClick={toggleChatBox}
        />
      )}
      {isChatOpen && (
        <div className={styles.liveChat}>
          <div className={styles.chatTop}>
            <button onClick={minimizeChatBox}>
              <FiMinus className={styles.icon} title="Minimize" />
            </button>
            <p>EU Africa LiveChat</p>
          </div>
          {chatUser && chatUser.role === 'chat' ? <MessengerBox /> : <WelcomeChat />}
          <div className={styles.chatBottom}>
            &copy; powered by
            <a href="/">
              Ernest apps
            </a>
          </div>
        </div>
      )}
      {isChatMinimized && (
        <IoChatbubblesOutline
          className={styles.chatBubble}
          style={{ color: iconColor }}
          onClick={toggleChatBox}
        />
      )}
    </PageLayout>
  );
};

export default LiveChat;
