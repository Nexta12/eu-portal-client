import React from 'react';
import { Alert } from 'antd';
import dayjs from 'dayjs';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
// import { DownloadButton } from '@components/Button';
import { DashboardContentLayout } from '@components/Layout';
import { AntTable } from '@components/Table';
import { formatNaira } from '@utils/currencyFormatter';

export type AccountStatementType = {
  type: 'credit' | 'debit';
  referenceNumber: string;
  amount: number;
  date: string;
  balance: number;
  description: string;
};

const columns = [
  {
    title: 'Payment Date',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: 'Reference Number',
    dataIndex: 'referenceNumber',
    key: 'referenceNumber'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'Debit',
    dataIndex: 'debit',
    key: 'debit'
  },
  {
    title: 'Credit',
    dataIndex: 'credit',
    key: 'credit'
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance'
  }
];

const AccountStatement = () => {
  const {
    data: accountStatementRecords,
    isLoading,
    error
  } = useSWR(endpoints.getAccountStatement, async () => {
    const res = await apiClient.get<AccountStatementType[]>(endpoints.getAccountStatement);
    return res.data;
  });

  const dataSource =
    accountStatementRecords?.map((payment, index) => ({
      key: `${payment.type}${index + 1}`,
      date: dayjs(payment.date).format('DD MMM YYYY'),
      referenceNumber: payment.referenceNumber,
      description: payment.description,
      debit: payment.type === 'debit' ? formatNaira.format(payment.amount) : '-',
      credit: payment.type === 'credit' ? formatNaira.format(payment.amount) : '-',
      balance: formatNaira.format(payment.balance)
    })) || [];

  return (
    <DashboardContentLayout title="Account Statement">
      {/* <div className="d-flex justify-content-end">
        <DownloadButton text="Download Statement" />
      </div> */}
      {error && (
        <Alert message="Error" description="Failed to fetch account statement" type="error" />
      )}
      <AntTable loading={isLoading} columns={columns} dataSource={dataSource} />
    </DashboardContentLayout>
  );
};

export default AccountStatement;
