import { JSX, ReactNode } from 'react';

export interface FormOption {
  label: string;
  value: string | number | boolean;
}

export interface NavItem {
  id?: number;
  title: string;
  link: string;
}

export interface SuccessResponse<T> {
  message: string;
  data: T;
}

export type AlertMessage = {
  error: string | JSX.Element | null;
  success: string | null;
};

export type InfoDisplayProps = {
  value?: string | ReactNode;
  label: string;
  lg: number;
};
