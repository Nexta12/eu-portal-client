import { AiOutlineThunderbolt } from 'react-icons/ai';
import { BsBarChartLine } from 'react-icons/bs';
import { SlCalender } from 'react-icons/sl';
import { AcademicCourse } from '@pages/Dashboard/AcademicsCard';
import { Notification } from '@pages/Dashboard/NotificationCard';

export const dummyStatisticsCards = [
  {
    title: 'Average Activity',
    icon: BsBarChartLine,
    value: '70%',
    description: 'Time you spend on the platform'
  },
  {
    title: 'Attendance',
    icon: SlCalender,
    value: '16/30',
    description: 'Classes you attended'
  },
  {
    title: 'Achievements',
    icon: AiOutlineThunderbolt,
    value: '8 Level',
    description: 'Your achievements'
  }
];

export const dummyCoursesToTake: AcademicCourse[] = [
  {
    type: 'class',
    title: 'Machine Learning',
    days: 2,
    progressPercent: 20
  },
  {
    type: 'class',
    title: 'Peace Resolution',
    days: 3,
    progressPercent: 70
  },
  {
    type: 'class',
    title: 'Land Management',
    days: 1,
    progressPercent: 2
  },
  {
    type: 'class',
    title: 'Introduction to AI',
    days: 2,
    progressPercent: 73
  },
  {
    type: 'class',
    title: 'Managing People',
    days: 3,
    progressPercent: 62
  },
  {
    type: 'class',
    title: 'Jedi Master',
    days: 10,
    progressPercent: 26
  }
];

export const dummyTestToTake: AcademicCourse[] = [
  {
    type: 'test',
    title: 'Machine Learning',
    days: 20
  },
  {
    type: 'test',
    title: 'Peace Resolution',
    days: 15
  },
  {
    type: 'assignment',
    title: 'Land Management',
    days: 10
  }
];

export const dummyNotifications: Notification[] = [
  {
    title: 'Orientation',
    message:
      'Ernest ipsum dolor sit ametis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry',
    level: 'info'
  },
  {
    title: 'Low Balance',
    message: 'Lorem ipsum dolor sit ametb',
    level: 'warning'
  },
  {
    title: 'Payment Successful',
    message: 'Lorem ipsum dolor sit ametab is simply dummy text of the printing and ',
    level: 'success'
  },
  {
    title: 'Test closing soon',
    message: 'Lorem ipsum dolor sit ametab is simply',
    level: 'error'
  }
];
