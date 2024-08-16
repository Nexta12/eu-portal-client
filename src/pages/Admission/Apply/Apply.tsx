import React, { useState } from 'react';
import { PageLayout } from '@components/Layout';
import ApplicationForm from './ApplicationForm';
import ApplicationSummary from './ApplicationSummary';

export enum ApplicationSteps {
  FORM = 'form',
  SUCCESS = 'success',
  FAILURE = 'failure'
}

const Apply = () => {
  const [currentStep, setCurrentStep] = useState<ApplicationSteps>(ApplicationSteps.FORM);
  const [studentEmail, setStudentEmail] = useState<string>('');

  return (
    <PageLayout siteTitle="Apply">
      {currentStep === ApplicationSteps.FORM && (
        <ApplicationForm setCurrentStep={setCurrentStep} setStudentEmail={setStudentEmail} />
      )}
      {currentStep !== ApplicationSteps.FORM && (
        <ApplicationSummary step={currentStep} email={studentEmail} />
      )}
    </PageLayout>
  );
};

export default Apply;
