import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { Button } from 'antd';
import dayjs from 'dayjs';
import useSWR, { mutate } from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { CustomModal } from '@components/Modal';
import { AntTable } from '@components/Table';
import { Bill } from '@customTypes/finance';
import { AlertMessage } from '@customTypes/general';
import { AdmissionStatus } from '@customTypes/user';
import { handleInitializePayment } from '@pages/Finance/MakePayment';
import useAuthStore from '@store/authStore';
import { DOLLAR_TO_NAIRA } from '@utils/constants';
import { formatNaira, formatUSDollar } from '@utils/currencyFormatter';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { ColumnsType } from 'antd/es/table';
import useSWRMutation from 'swr/mutation';

type Payment = Pick<Bill, 'type' | 'amountUsd' | 'dueDate'>;
type BillToPay = Pick<Bill, 'id' | 'type' | 'amountUsd'>;

const columns: ColumnsType<Payment> = [
  {
    title: 'Payment Type',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'Amount USD',
    dataIndex: 'amountUsd',
    key: 'amountUsd',
    render: (paymentAmount: number) => <span>{formatUSDollar.format(paymentAmount)}</span>
  },
  {
    title: 'Amount NGN',
    dataIndex: 'amountNgn',
    key: 'amountNgn',
    render: (paymentAmount: number) => <span>{formatNaira.format(paymentAmount)}</span>
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action'
  }
];

interface BillsTableProps {
  setMessage: Dispatch<SetStateAction<AlertMessage>>;
}

const compulsoryBills = new Set(['Tuition Fee', 'ICT Levy']);

const handlePayBillRequest = async (url: string, { arg }: { arg: { billId: string } }) => {
  const { billId } = arg;
  const response = await apiClient.put(url, { billId });
  return response.data;
};

export const BillsTable = ({ setMessage }: BillsTableProps) => {
  const { user } = useAuthStore();
  const { trigger: triggerInitializePayment, isMutating: initializePaymentMutating } =
    useSWRMutation(endpoints.initializePayment, handleInitializePayment);
  const {
    data: bills,
    isLoading,
    mutate: mutateBills
  } = useSWR('bills', async () => {
    const response = await apiClient.get<Bill[]>(`${endpoints.getBills}?isPaid=false`);
    return response.data;
  });
  const { trigger: triggerPayBill, isMutating: payBillMutating } = useSWRMutation(
    endpoints.payBill,
    handlePayBillRequest
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [billToPay, setBillToPay] = useState<BillToPay | null>(null);

  const hasCompulsoryFee = useMemo(
    () => bills?.some((bill) => compulsoryBills.has(bill.type)),
    [bills]
  );

  const initializePayment = useCallback(
    async (amount: number, description: string) => {
      try {
        const res = await triggerInitializePayment({ amount, description });
        window.open(res.data.url);
      } catch (err) {
        const axiosError = getAxiosError(err);
        setMessage({ error: formatErrors(axiosError.errorData), success: null });
      }
    },
    [setMessage, triggerInitializePayment]
  );

  const handlePayBill = async () => {
    if (!billToPay) {
      return;
    }

    try {
      await triggerPayBill({ billId: billToPay.id });
      setShowConfirmModal(false);
      await mutateBills();
      await mutate(endpoints.getBalance);
      setMessage({ error: null, success: 'Payment successful' });
    } catch (err) {
      const axiosError = getAxiosError(err);
      setShowConfirmModal(false);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  const initialBillPayment = (bill: BillToPay) => {
    setBillToPay(bill);
    setShowConfirmModal(true);
  };

  const studentBills = useMemo(() => {
    if (!bills) {
      return [];
    }

    return bills.map((bill) => ({
      key: bill.id,
      type: bill.type,
      description: bill.description,
      amountUsd: bill.amountUsd,
      amountNgn: bill.amountUsd * DOLLAR_TO_NAIRA,
      dueDate: bill.dueDate ? dayjs(bill.dueDate).format('DD/MM/YYYY') : '-',
      action:
        user?.admissionStatus === AdmissionStatus.APPLICATION ? (
          <Button
            type="primary"
            onClick={() => initializePayment(bill.amountUsd * DOLLAR_TO_NAIRA, bill.type)}
            loading={initializePaymentMutating}
          >
            Pay
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => initialBillPayment(bill)}
            disabled={hasCompulsoryFee && compulsoryBills.has(bill.type)}
          >
            Pay
          </Button>
        )
    }));
  }, [
    bills,
    hasCompulsoryFee,
    initializePayment,
    initializePaymentMutating,
    user?.admissionStatus
  ]);

  return (
    <>
      <AntTable
        columns={columns}
        dataSource={studentBills}
        loading={isLoading}
        emptyText="Student does not have any pending bills"
      />
      <CustomModal
        open={showConfirmModal}
        onOk={handlePayBill}
        onCancel={() => setShowConfirmModal(false)}
        title="Confirm Payment"
        type="warning"
        confirmLoading={payBillMutating}
      >
        {billToPay ? (
          <div>
            You are about to pay {formatNaira.format(billToPay.amountUsd * DOLLAR_TO_NAIRA)} for{' '}
            {billToPay.type}
          </div>
        ) : (
          <div>No bill to pay</div>
        )}
      </CustomModal>
    </>
  );
};
