import React, { ChangeEvent, useMemo, useState } from 'react';
import { TbArrowsDownUp } from 'react-icons/tb';
import { Button, Card, Form } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, InputField } from '@components/Form';
import { CustomModal } from '@components/Modal';
import { AccountBalance } from '@customTypes/finance';
import styles from '@pages/Finance/Finance.module.scss';
import { handleInitializePayment } from '@pages/Finance/MakePayment';
import { formatNaira } from '@utils/currencyFormatter';
import { formatDate } from '@utils/helpers';
import useSWRMutation from 'swr/mutation';

const MINIMUM_PAYMENT = 5000;

const BalanceCard = () => {
  const { data } = useSWR(endpoints.getBalance, async (url) => {
    const response = await apiClient.get<AccountBalance>(url);
    return response.data;
  });
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [form] = Form.useForm();
  const { trigger: makePayment, isMutating } = useSWRMutation(
    endpoints.initializePayment,
    handleInitializePayment
  );

  const accountBalance = useMemo(() => {
    if (!data) {
      return {
        balance: 0,
        lastDeposit: null
      };
    }

    const date = data.lastDeposit?.paidAt ? formatDate(data.lastDeposit.paidAt) : null;

    return {
      balance: data.balance,
      lastDeposit: date
    };
  }, [data]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    form.setFieldValue('amount', numericValue);
    setAmount(numericValue);
  };

  const handlePayment = async () => {
    const res = await makePayment({ amount: Number(amount), description: 'Deposit' });
    window.open(res.data.url);
    setShowModal(false);
  };

  return (
    <>
      <Card className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="font-weight-bold">Balance</div>
            <div className="font-weight-bold font-larger">
              {formatNaira.format(accountBalance.balance)}
            </div>
            {accountBalance.lastDeposit && (
              <div className="font-style-italic font-smaller">
                Last deposit: {accountBalance.lastDeposit}
              </div>
            )}
          </div>
          <div>
            <Button
              type="primary"
              size="large"
              className={styles.depositButton}
              onClick={() => setShowModal(true)}
            >
              <TbArrowsDownUp size={20} />
              <div>Deposit</div>
            </Button>
          </div>
        </div>
      </Card>
      <CustomModal
        open={showModal}
        onOk={handlePayment}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
          setAmount('');
        }}
        showFooter={false}
      >
        <FormWrapper
          className="d-flex flex-direction-column justify-content-center py-2"
          form={form}
        >
          <div className="font-large mb-1">How much would you like to deposit?</div>
          <InputField name="amount" value={amount} onChange={handleInputChange} />
          <div className="mt-n2 mb-2">
            {Number(amount) < MINIMUM_PAYMENT ? (
              <div className="font-small font-style-italic">
                Minimum payment is {formatNaira.format(Number(MINIMUM_PAYMENT))}
              </div>
            ) : (
              <div className="font-small font-style-italic font-weight-bold">
                Please note: You are about to deposit {formatNaira.format(Number(amount))} into your
                account.
              </div>
            )}
          </div>
          <Button
            type="primary"
            size="large"
            onClick={handlePayment}
            disabled={!amount || Number(amount) < MINIMUM_PAYMENT}
            loading={isMutating}
          >
            Pay
          </Button>
        </FormWrapper>
      </CustomModal>
    </>
  );
};

export default BalanceCard;
