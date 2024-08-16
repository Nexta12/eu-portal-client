import React, { useState } from 'react';
import { Alert } from 'antd';
import apiClient from '@api/apiClient';
import { DashboardContentLayout } from '@components/Layout';
import { AlertMessage } from '@customTypes/general';
import { AdmissionStatus } from '@customTypes/user';
import BalanceCard from '@pages/Finance/BalanceCard';
import { BillsTable } from '@pages/Finance/BillsTable';
import useAuthStore from '@store/authStore';

interface PaymentData {
  amount: number;
  description: string;
}

export const handleInitializePayment = async (url: string, { arg }: { arg: PaymentData }) => {
  const { amount, description } = arg;
  const response = await apiClient.post(url, {
    amount,
    description
  });
  return response.data;
};

const MakePayment = () => {
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const { user } = useAuthStore();

  return (
    <DashboardContentLayout
      title="Make Payment"
      description="This is the fee due to process your admission."
    >
      {(message.success || message.error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      {user?.admissionStatus === AdmissionStatus.ADMITTED && <BalanceCard />}
      <BillsTable setMessage={setMessage} />
    </DashboardContentLayout>
  );
};

export default MakePayment;
