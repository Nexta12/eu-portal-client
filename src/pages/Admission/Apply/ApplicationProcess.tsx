import React, { useEffect } from 'react';
import { AdmissionStatus } from '@customTypes/user';
import ApplicationComplete from '@pages/Admission/Apply/ApplicationComplete';
import { MakePayment } from '@pages/Finance';
import useAuthStore from '@store/authStore';
import UploadDocuments from './UploadDocuments';

enum ApplicationProcessSteps {
  MAKE_PAYMENT = 'make_payment',
  UPLOAD_DOCUMENT = 'upload_document',
  COMPLETE_APPLICATION = 'complete_application'
}

const ApplicationProcess = () => {
  const [currentStep, setCurrentStep] = React.useState<ApplicationProcessSteps>(
    ApplicationProcessSteps.MAKE_PAYMENT
  );
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.admissionStatus === AdmissionStatus.APPLICATION_FEE_PAID) {
      setCurrentStep(ApplicationProcessSteps.UPLOAD_DOCUMENT);
    } else if (user?.admissionStatus === AdmissionStatus.IN_REVIEW) {
      setCurrentStep(ApplicationProcessSteps.COMPLETE_APPLICATION);
    }
  }, [user?.admissionStatus]);

  return (
    <div>
      {currentStep === ApplicationProcessSteps.MAKE_PAYMENT && <MakePayment />}
      {currentStep === ApplicationProcessSteps.UPLOAD_DOCUMENT && <UploadDocuments />}
      {currentStep === ApplicationProcessSteps.COMPLETE_APPLICATION && <ApplicationComplete />}
    </div>
  );
};

export default ApplicationProcess;
