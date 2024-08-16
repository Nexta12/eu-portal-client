import React from 'react';
import { PiDownloadBold } from 'react-icons/pi';
import { Button, ButtonProps } from 'antd';

interface DownloadButtonProps extends ButtonProps {
  text: string;
}

export const DownloadButton = ({ text, ...props }: DownloadButtonProps) => (
  <Button size="large" className="mb-2" type="primary" {...props}>
    <div className="d-flex">
      <PiDownloadBold size={20} className="mr-1" />
      <div>{text}</div>
    </div>
  </Button>
);
