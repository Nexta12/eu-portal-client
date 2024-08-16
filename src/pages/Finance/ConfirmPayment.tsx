import React, { useCallback, useEffect, useState } from 'react';
import { AiFillCheckSquare, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { GiCancel } from 'react-icons/gi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card } from 'antd';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { SuccessResponse } from '@customTypes/general';
import { AdmissionStatus, StudentProfile } from '@customTypes/user';
import { paths } from '@routes/paths';
import useAuthStore from '@store/authStore';
import styles from './Finance.module.scss';

enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

type PaymentVerificationResponse = {
  success: boolean;
  message: string;
  paidAt: string;
};

const ConfirmPayment = () => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
  const [error, setError] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referenceNumber = searchParams.get('reference');
  const { user, updateUser } = useAuthStore();
  const isApplication = user?.admissionStatus === AdmissionStatus.APPLICATION_FEE_PAID;

  const updateApplicationStatus = useCallback(async () => {
    try {
      const { data: resData } = await apiClient.get<SuccessResponse<StudentProfile>>(
        `${endpoints.students}/${user?.userId}`
      );
      updateUser({ admissionStatus: resData.data.admissionStatus });
    } catch {
      setError(true);
    }
  }, [updateUser, user?.userId]);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await apiClient.get<PaymentVerificationResponse>(
          `${endpoints.verifyPayment}/${referenceNumber}`
        );
        setPaymentStatus(response.data.success ? PaymentStatus.SUCCESS : PaymentStatus.FAILURE);
        if (user?.admissionStatus === AdmissionStatus.APPLICATION) {
          await updateApplicationStatus();
        }
        setError(false);
      } catch {
        setError(true);
      }
    };
    fetchPaymentInfo();
  }, [referenceNumber, searchParams, updateApplicationStatus, user?.admissionStatus]);

  return (
    <DashboardContentLayout
      className="d-flex justify-content-center mt-4"
      siteTitle="Confirm Payment"
    >
      <Card className="width-50 text-center">
        {error && (
          <div className="text-color-error">An error occurred while fetching your data</div>
        )}
        {paymentStatus === PaymentStatus.PENDING && (
          <>
            <h2>Confirming Payment</h2>
            <AiOutlineLoading3Quarters size={50} className={styles.loadingIcon} />
            <div className="mt-2">Please wait while we confirm your payment.</div>
          </>
        )}
        {paymentStatus === PaymentStatus.SUCCESS && (
          <>
            <h2>Payment Success</h2>
            <AiFillCheckSquare size={50} className="background-color-success mt-2" />
            <div className="mt-2">Payment has been confirmed successfully 🎉</div>
            <Button
              size="large"
              type="primary"
              className="mt-2"
              onClick={() =>
                isApplication ? navigate(paths.applicationProcess) : navigate(paths.makePayment)
              }
            >
              {isApplication ? 'Proceed to upload documents' : 'Go back to payment page'}
            </Button>
          </>
        )}
        {paymentStatus === PaymentStatus.FAILURE && (
          <>
            <h2>Payment Failure</h2>
            <GiCancel size={50} className="text-color-error mt-2" />
            <div className="mt-2">
              <div>
                Payment could not be confirmed. Please contact the admin with your reference number
              </div>
              <div className="font-weight-bolder">Reference Number: {referenceNumber}</div>
            </div>
          </>
        )}
      </Card>
    </DashboardContentLayout>
  );
};

export default ConfirmPayment;
