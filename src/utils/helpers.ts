import dayjs from 'dayjs';
import { SupportTicketStatus } from '@customTypes/tickets';
import { AdmissionStatus, UserRole } from '@customTypes/user';
import { LoggedInUser } from '@store/authStore';
import advancedFormat from 'dayjs/plugin/advancedFormat';

export const isApplicationInProgress = (currentUser: LoggedInUser) =>
  currentUser.admissionStatus === AdmissionStatus.APPLICATION ||
  currentUser.admissionStatus === AdmissionStatus.APPLICATION_FEE_PAID ||
  currentUser.admissionStatus === AdmissionStatus.IN_REVIEW;

const splitAndJoinString = (inputString: string) => {
  const modifiedString = inputString.replace(/[_-]/g, ' ');
  return modifiedString.split(' ').slice(0, -1).join(' ');
};

export const extractNameFromFileUrl = (url: string): string => {
  const defaultName = 'File Name';
  const parts = url.split('/');
  const lastPart = parts.at(-1);
  const extensionIndex = lastPart?.lastIndexOf('.');

  if (extensionIndex !== -1) {
    return lastPart ? splitAndJoinString(lastPart.slice(0, extensionIndex)) : defaultName;
  }

  return lastPart ? splitAndJoinString(lastPart) : defaultName;
};

export const bytesToKbOrMb = (bytes: number) => {
  const convertedValue =
    bytes < 1024 ? bytes / 1024 : bytes < 1024 ** 2 ? bytes / 1024 : bytes / 1024 ** 2;
  const unit = bytes < 1024 ? 'KB' : bytes < 1024 ** 2 ? 'KB' : 'MB';
  return `${convertedValue.toFixed(2)} ${unit}`;
};

export const formatDate = (date: string | Date) => {
  dayjs.extend(advancedFormat);
  return dayjs(date).format('Do MMM. YYYY');
};

export const monthsToYears = (months: number | string) => {
  if (typeof months === 'string') {
    return Number.parseInt(months, 10);
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const yearString = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
  const monthString =
    remainingMonths > 0 ? `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : '';

  return [yearString, monthString].filter(Boolean).join(',');
};

export const roleOptions = [
  { value: UserRole.admin, label: 'Administrator' },
  { value: UserRole.staff, label: 'Admin Staff' }
];

export const capitalizeWords = (str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase());

type Styles = { [key: string]: string };

export const getStatusClass = (styles: Styles, status?: SupportTicketStatus | string): string => {
  switch (status) {
    case SupportTicketStatus.OPEN: {
      return styles['status-open'];
    }

    case SupportTicketStatus.CLOSED: {
      return styles['status-closed'];
    }

    case SupportTicketStatus.AWAITING_ADMIN_REPLY: {
      return styles['status-awaiting-reply'];
    }

    default: {
      return styles['status-default'];
    }
  }
};
