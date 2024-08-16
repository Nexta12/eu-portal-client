import React, { ReactNode } from 'react';
import { Modal, ModalProps } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

type ConfirmationModalProps = {
  title?: string;
  children: ReactNode;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  type?: 'default' | 'warning';
  showFooter?: boolean;
} & ModalProps;

const WarningTitle = ({ text }: { text: string | ReactNode }) => (
  <div className="d-flex gap-1 align-items-center">
    <ExclamationCircleOutlined className="text-color-warning font-larger font-weight-bolder" />
    <div className="font-semi-large">{text}</div>
  </div>
);

export const CustomModal = ({
  open,
  onOk,
  onCancel,
  children,
  title,
  type = 'default',
  showFooter = true,
  ...props
}: ConfirmationModalProps) => (
  <Modal
    title={title && type === 'warning' ? <WarningTitle text={title} /> : <h3>{title}</h3>}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    footer={showFooter ? undefined : null}
    {...props}
  >
    {children}
  </Modal>
);
