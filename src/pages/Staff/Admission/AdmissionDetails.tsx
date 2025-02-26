import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Card, Col, Form, Row } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { FormWrapper, RadioField, TextAreaField } from '@components/Form';
import { DashboardContentLayout } from '@components/Layout';
import { CustomModal } from '@components/Modal';
import { AlertMessage, InfoDisplayProps, SuccessResponse } from '@customTypes/general';
import { ProcessAdmissionStatus, StudentProfile } from '@customTypes/user';
import { admissionStatusTag } from '@pages/Staff/Admission/Admissions';
import { formatErrors } from '@utils/errorFormatter';
import { extractNameFromFileUrl } from '@utils/helpers';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';
import styles from './AdmissionDetail.module.scss';

const InfoDisplay = ({ value, label, lg }: InfoDisplayProps) => (
  <Col sm={24} lg={lg} className="px-3 py-2">
    <div className="font-weight-bold">{label}</div>
    <div>{value || <div className="text-color-error">None</div>}</div>
  </Col>
);

type AdmissionValue = {
  status: ProcessAdmissionStatus;
  comment: string;
};

const admissionStatusOptions = [
  { value: ProcessAdmissionStatus.APPROVED, label: 'Approve Application' },
  { value: ProcessAdmissionStatus.REJECTED, label: 'Reject Application' }
];

const AdmissionDetails = () => {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [processAdmissionValue, setProcessAdmissionValue] = useState<AdmissionValue>({
    status: ProcessAdmissionStatus.APPROVED,
    comment: ''
  });
  const { trigger: triggerProcessAdmission, isMutating } = useSWRMutation(
    endpoints.processAdmission,
    (url) => apiClient.post(url, { ...processAdmissionValue, studentId: params.userId })
  );
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  const {
    data: studentDetails,
    isLoading,
    mutate
  } = useSWR(`students/${params.userId}`, async (url) => {
    const res = await apiClient.get<SuccessResponse<StudentProfile>>(url);
    return res.data.data;
  });

  const processAdmission = async () => {
    try {
      await triggerProcessAdmission();
      await mutate();
      setIsModalOpen(false);
      setMessage({ error: null, success: 'Admission processed successfully' });
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  return (
    <>
      <DashboardContentLayout title="Admission Details">
        {(message.success || message.error) && (
          <Alert
            type={message.error ? 'error' : 'success'}
            message={message.error ?? message.success}
            className="width-100 mb-2"
            closable
            onClose={() => setMessage({ error: null, success: null })}
          />
        )}
        {!isLoading && studentDetails ? (
          <div className="d-flex flex-direction-column gap-4 mb-1">
            <Card className={styles.info}>
              <h1>Personal Information</h1>
              <Row gutter={[24, 24]} className={styles.personalInfo}>
                <Col sm={24} lg={18}>
                  <Row gutter={[24, 24]}>
                    <InfoDisplay value={studentDetails.title} label="Title" lg={8} />
                    <InfoDisplay value={studentDetails.firstName} label="First Name" lg={8} />
                    <InfoDisplay value={studentDetails.lastName} label="Last Name" lg={8} />
                    <InfoDisplay value={studentDetails.gender} label="Gender" lg={8} />
                    <InfoDisplay
                      value={studentDetails.dateOfBirth?.toString()}
                      label="Date of Birth"
                      lg={8}
                    />
                    <InfoDisplay value={studentDetails.nationality} label="Nationality" lg={8} />
                    <InfoDisplay
                      value={admissionStatusTag[studentDetails.admissionStatus]}
                      label="Admission Status"
                      lg={8}
                    />
                  </Row>
                </Col>
                <Col sm={24} lg={4} offset={1}>
                  <img
                    className={styles.image}
                    src={studentDetails.document?.picture}
                    alt="Profile"
                  />
                </Col>
              </Row>
            </Card>
            <Card className={styles.info}>
              <h1>Contact Information</h1>
              <Row gutter={[24, 24]}>
                <InfoDisplay value={studentDetails.email} label="Email" lg={8} />
                <InfoDisplay value={studentDetails.phoneNumber} label="Phone Number" lg={8} />
                <InfoDisplay value={studentDetails.country} label="Country" lg={8} />
                <InfoDisplay value={studentDetails.city} label="City" lg={8} />
                <InfoDisplay value={studentDetails.zipCode} label="Postal Code" lg={8} />
                <InfoDisplay value={studentDetails.address} label="Address" lg={8} />
              </Row>
            </Card>
            <Card className={styles.info}>
              <h1>Application Information</h1>
              <Row gutter={[24, 24]}>
                <InfoDisplay value={studentDetails.programme?.name} label="Programme" lg={8} />
                <InfoDisplay label="Cohort" value={studentDetails.cohort} lg={8} />
                <InfoDisplay
                  value={studentDetails.employmentStatus}
                  label="Employment Status"
                  lg={8}
                />
              </Row>
            </Card>
            <Card className={styles.info}>
              <h1>Documents</h1>
              <div>
                {studentDetails?.document?.docs ? (
                  studentDetails.document?.docs.map((document, index) => {
                    const filename = extractNameFromFileUrl(document.url);
                    return (
                      <div className="mb-1" key={index}>
                        <a href={document.url} target="_blank" rel="noopener noreferrer">
                          {filename}
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <div>No documents</div>
                )}
              </div>
            </Card>
            <div className="d-flex justify-content-evenly">
              <Button type="primary" size="large" block onClick={() => setIsModalOpen(true)}>
                Process Admission
              </Button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </DashboardContentLayout>
      <CustomModal
        open={isModalOpen}
        onOk={processAdmission}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isMutating}
        title="Process Admission"
        okText="Submit"
        okButtonProps={{ disabled: !processAdmissionValue.comment }}
      >
        <FormWrapper form={form}>
          <RadioField
            options={admissionStatusOptions}
            value={processAdmissionValue.status}
            onChange={(e) =>
              setProcessAdmissionValue({ ...processAdmissionValue, status: e.target.value })
            }
            className="mt-1"
            name="status"
          />
          <TextAreaField
            name="comment"
            label="Comment"
            className="mt-2"
            onChange={(e) =>
              setProcessAdmissionValue({ ...processAdmissionValue, comment: e.target.value })
            }
            value={processAdmissionValue.comment}
          />
        </FormWrapper>
      </CustomModal>
    </>
  );
};

export default AdmissionDetails;
