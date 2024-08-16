import React from 'react';
import { Button, ButtonProps } from 'antd';
import cn from 'classnames';
import styles from './Button.module.scss';

interface LargerButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const LargerButton = ({ children, className = '', ...props }: LargerButtonProps) => (
  <Button {...props} className={cn(styles.largerButton, { [className]: className })}>
    {children}
  </Button>
);
