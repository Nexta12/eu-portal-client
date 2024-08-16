import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '@components/Header';
import { Sidebar, SidebarType } from '@components/Sidebar';
import { UserRole } from '@customTypes/user';
import useAuthStore, { LoggedInUser } from '@store/authStore';
import { isApplicationInProgress } from '@utils/helpers';
import { Socket, io } from 'socket.io-client';
import styles from './Dashboard.module.scss';

export const getUserType = (user: LoggedInUser): SidebarType => {
  const userType = {
    [UserRole.student]: 'user',
    [UserRole.staff]: 'staff',
    [UserRole.admin]: 'staff',
    [UserRole.chat]: 'chat'
  };

  return isApplicationInProgress(user) ? 'application' : (userType[user.role] as SidebarType);
};
const Dashboard = () => {
  const { user } = useAuthStore();
  const sideBarType = user ? getUserType(user) : 'user';
  const [showSidebar, setShowSidebar] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadChats, setUnreadChats] = useState<number>(0);
  const [unreadTickets, setUnreadTickets] = useState<number>(0);
  const [studentUnreadTickets, setStudentUnreadTickets] = useState<number>(0);

  useEffect(() => {
    const socketInstance = io('ws://localhost:4000');
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('getUnreadChats');
      socket.emit('getStudentUnreadTickets', { data: user?.userId });
      socket.emit('getUnreadTickets');
    }
  }, [socket, user?.userId]);

  useEffect(() => {
    if (socket) {
      socket.on('totalUnreadChats', (data: number) => {
        setUnreadChats(data);
      });
    }
    return () => {
      socket?.off('totalUnreadChats');
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('totalUnreadTickets', (data: number) => {
        setUnreadTickets(data);
      });
      socket.on('totalStudentUnreadTickets', (data: number) => {
        setStudentUnreadTickets(data);
      });
    }
    return () => {
      socket?.off('totalUnreadTickets');
      socket?.off('totalStudentUnreadTickets');
    };
  }, [socket]);

  return (
    <div className={styles.dashboardLayoutContainer}>
      <DashboardHeader setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
      <Sidebar
        type={sideBarType}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        ticketCount={unreadTickets || 0}
        studentTicketCount={studentUnreadTickets || 0}
        totalUnreadChats={unreadChats || 0}
      />
      <div className="mb-2 width-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
