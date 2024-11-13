import React, { Key, ReactNode } from 'react';
import {
  AiOutlineBook,
  AiOutlineHome,
  AiOutlineInbox,
  AiOutlineProfile,
  AiOutlineWallet
} from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import {
  BsBlockquoteLeft,
  BsBook,
  BsBookmarksFill,
  BsBorderWidth,
  BsCalendar3,
  BsPeople,
  BsPlusLg
} from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { HiOutlineAcademicCap, HiOutlineDocumentText } from 'react-icons/hi';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { LiaBullhornSolid } from 'react-icons/lia';
import { MdDashboard } from 'react-icons/md';
import { TfiExchangeVertical } from 'react-icons/tfi';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Badge, Menu, MenuProps } from 'antd';
import { paths } from '@routes/paths';
import useAuthStore from '@store/authStore';
import styles from './Sidebar.module.scss';

type MenuItem = Required<MenuProps>['items'][number];
const sideBarIconSize = 20;

type GetItemParams = {
  label: ReactNode;
  key: Key;
  icon?: ReactNode;
  children?: MenuItem[];
  type?: 'group';
  onClick?: () => void;
  badge?: ReactNode;
};

const getItem = ({ label, key, type, icon, children, onClick, badge }: GetItemParams): MenuItem =>
  ({
    key,
    icon,
    children,
    label: (
      <>
        {label}
        {badge && <span style={{ marginLeft: 8 }}>{badge}</span>}
      </>
    ),
    type,
    onClick
  } as MenuItem);

const getStudentSidebarItems = (
  navigate: NavigateFunction,
  setShowSidebar: (data: boolean) => void,
  studentTicketCount: number
): MenuProps['items'] => {
  const handleOnClick = (path: string) => {
    setShowSidebar(false);
    navigate(path);
  };

  return [
    getItem({
      label: 'Home',
      key: 'home',
      icon: <AiOutlineHome size={sideBarIconSize} />,
      onClick: () => handleOnClick(paths.dashboardHome)
    }),
    getItem({
      label: 'Courses',
      key: 'courses',
      icon: <AiOutlineBook size={sideBarIconSize} />,
      children: [
        getItem({
          label: 'Pre-registration',
          key: 'courses_pre_registration',
          onClick: () => handleOnClick(paths.preRegistration)
        }),
        getItem({
          label: 'Enrolments',
          key: '6',
          onClick: () => handleOnClick(paths.enrolments)
        })
      ]
    }),
    getItem({
      label: 'Finance',
      key: 'finance',
      icon: <AiOutlineWallet size={sideBarIconSize} />,
      children: [
        getItem({
          label: 'Make payment',
          key: 'finance_make_payment',
          onClick: () => handleOnClick(paths.makePayment)
        }),
        getItem({
          label: 'Account statement',
          key: 'finance_account_statement',
          onClick: () => handleOnClick(paths.accountStatement)
        })
      ]
    }),
    getItem({
      label: 'Account',
      key: 'account',
      icon: <AiOutlineProfile size={sideBarIconSize} />,
      children: [
        getItem({
          label: 'Profile',
          key: '12',
          onClick: () => handleOnClick(paths.profile)
        }),
        getItem({
          label: 'Documents',
          key: '13',
          onClick: () => handleOnClick(paths.documents)
        }),
        getItem({
          label: 'Transcript',
          key: '14',
          onClick: () => handleOnClick(paths.transcript)
        }),
        getItem({
          label: 'Change password',
          key: 'account_change_password',
          onClick: () => handleOnClick(paths.changePassword)
        })
      ]
    }),
    getItem({
      label: 'Support Ticket',
      key: 'support_tickets',
      icon: <AiOutlineWallet size={sideBarIconSize} />,
      badge: <Badge count={studentTicketCount} style={{ backgroundColor: '#f5222d' }} />,
      onClick: () => handleOnClick(paths.tickets)
    })
  ];
};

const getApplicationSidebarItems = (
  navigate: NavigateFunction,
  setShowSidebar: (data: boolean) => void
): MenuProps['items'] => {
  const handleOnClick = (path: string) => {
    setShowSidebar(false);
    navigate(path);
  };

  return [
    getItem({
      label: 'Application Process',
      key: 'application_process',
      icon: <HiOutlineDocumentText size={sideBarIconSize} />,
      onClick: () => handleOnClick(paths.applicationProcess)
    }),
    getItem({
      label: 'Change password',
      key: 'change_password',
      icon: <TfiExchangeVertical size={sideBarIconSize} />,
      onClick: () => handleOnClick(paths.changePassword)
    })
  ];
};

const getStaffSidebarItems = (
  navigate: NavigateFunction,
  setShowSidebar: (data: boolean) => void,
  ticketCount: number,
  totalUnreadChats: number,
  unreadMessagesCount: number,
  user: any
): MenuProps['items'] => {
  const handleOnClick = (path: string) => {
    setShowSidebar(false);
    navigate(path);
  };
  return [
    getItem({
      label: 'Dashboard',
      key: 'dashboard',
      icon: <MdDashboard size={sideBarIconSize} />,
      onClick: () => handleOnClick(paths.adminDashboard)
    }),
    getItem({
      label: 'Admission',
      key: 'admissionss',
      icon: <AiOutlineInbox size={sideBarIconSize} />,
      children: [
        getItem({
          label: 'Admitted',
          key: 'admitted_Learners',
          onClick: () => handleOnClick(paths.admittedList)
        }),
        getItem({
          label: 'In Review',
          key: 'in_reviw',
          onClick: () => handleOnClick(paths.inreviewList)
        }),
        getItem({
          label: 'Rejected',
          key: 'rejected_applicat',
          onClick: () => handleOnClick(paths.rejectList)
        }),
        getItem({
          label: 'Paid Application Fee',
          key: 'paid_feee',
          onClick: () => handleOnClick(paths.feepaidList)
        }),
        getItem({
          label: 'New Application',
          key: 'just_applying',
          onClick: () => handleOnClick(paths.applicationList)
        })
      ]
    }),

    getItem({
      label: 'Staff',
      key: 'staffs',
      icon: <BsPeople size={sideBarIconSize} />,
      onClick: () => handleOnClick(paths.staffs)
    }),
    getItem({
      label: 'Academics',
      key: 'academics',
      icon: <HiOutlineAcademicCap size={sideBarIconSize} />,
      children: [
        getItem({
          label: 'Faculties',
          key: 'academics_faculties',
          onClick: () => handleOnClick(paths.faculties)
        }),
        getItem({
          label: 'Programmes',
          key: 'academics_programmes',
          onClick: () => handleOnClick(paths.programmes)
        }),
        getItem({
          label: 'Courses',
          key: 'academics_courses',
          onClick: () => handleOnClick(paths.programmesAndCourses)
        })
      ]
    }),
    getItem({
      label: 'Blogs',
      key: 'blogs',
      icon: <BsBook size={sideBarIconSize} />,
      children: [
        getItem({
          label: 'Create New',
          key: 'create_new_blog',
          icon: <BsPlusLg size={sideBarIconSize} />,
          onClick: () => handleOnClick(paths.newBlog)
        }),
        getItem({
          label: 'Blog List',
          key: 'blogList',
          icon: <BsCalendar3 size={sideBarIconSize} />,
          onClick: () => handleOnClick(paths.blogList)
        }),
        getItem({
          label: 'Categories',
          key: 'category',
          icon: <BsBorderWidth size={sideBarIconSize} />,
          onClick: () => handleOnClick(paths.categories)
        })
      ]
    }),
    getItem({
      label: 'Messages',
      key: 'messages',
      icon: <CiMail size={sideBarIconSize} />,
      badge: <Badge count={unreadMessagesCount} style={{ backgroundColor: '#f5222d' }} />,
      onClick: () => handleOnClick(paths.contactMessages)
    }),
    getItem({
      label: 'School Activites',
      key: 'events',
      icon: <BsBookmarksFill size={sideBarIconSize} />,
      onClick: () => handleOnClick(paths.events)
    }),
    getItem({
      label: 'Broadcast',
      key: 'broadcast',
      icon: <LiaBullhornSolid size={sideBarIconSize} />,
      onClick: () => handleOnClick(paths.notifications)
    }),
    getItem({
      label: 'Support Tickets',
      key: 'tickets',
      icon: <BsBlockquoteLeft size={sideBarIconSize} />,
      badge: <Badge count={ticketCount} style={{ backgroundColor: '#f5222d' }} />,
      onClick: () => handleOnClick(paths.ticketsList)
    }),
    getItem({
      label: 'Live Chat',
      key: 'livechat',
      icon: <IoChatbubblesOutline size={sideBarIconSize} />,
      badge: <Badge count={totalUnreadChats} style={{ backgroundColor: '#f5222d' }} />,
      onClick: () => handleOnClick(paths.liveChat)
    }),
    getItem({
      label: 'My Profile',
      key: 'profile',
      icon: <BiUser size={sideBarIconSize} />,
      onClick: () => handleOnClick(`${paths.viewStaff}/${user?.userId}`)
    })
  ];
};

export type SidebarType = 'application' | 'user' | 'staff';

interface SidebarProps {
  type: SidebarType;
  showSidebar: boolean;
  setShowSidebar: (data: boolean) => void;
  ticketCount?: number;
  unreadMessagesCount?: number;
  studentTicketCount?: number;
  totalUnreadChats?: number;
}

export const Sidebar = ({
  type,
  showSidebar,
  setShowSidebar,
  ticketCount = 0,
  unreadMessagesCount = 0,
  studentTicketCount = 0,
  totalUnreadChats = 0
}: SidebarProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const getSidebarItemWithType = {
    application: getApplicationSidebarItems(navigate, setShowSidebar),
    user: getStudentSidebarItems(navigate, setShowSidebar, studentTicketCount),
    staff: getStaffSidebarItems(
      navigate,
      setShowSidebar,
      ticketCount,
      totalUnreadChats,
      unreadMessagesCount,
      user
    )
  };
  const sidebarItems = getSidebarItemWithType[type] || [];
  const firstItemKey = sidebarItems.length > 0 ? sidebarItems[0]?.key : '';

  return (
    <Menu
      className={`${styles[showSidebar ? 'displaySidebar' : 'sidebarContainer']}`}
      defaultSelectedKeys={[firstItemKey] as string[]}
      mode="inline"
      items={sidebarItems}
    />
  );
};
