import React from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { GiCancel } from 'react-icons/gi';
import { PageLayout } from '@components/Layout';
import { ApplicationSteps } from '@pages/Admission/Apply/Apply';

const ApplicationSummary = ({ step, email }: { step: ApplicationSteps; email: string }) => (
  <PageLayout siteTitle="Application Summary" className="text-center">
    {step === ApplicationSteps.SUCCESS && (
      <div className="pb-5">
        <BsCheckCircleFill size={60} color="green" />
        <h1 className="mt-2">Thank you</h1>
        <div className="mt-1">
          Your application has been submitted successfully. Please check your email <b>{email}</b>{' '}
          for the next steps
        </div>
      </div>
    )}
    {step === ApplicationSteps.FAILURE && (
      <div className="pb-5">
        <GiCancel size={60} className="text-color-error" />
        <h1 className="mt-2">An Error Occurred</h1>
        <div className="mt-1">
          We are unable to process your application at this time. Please try again later.
        </div>
      </div>
    )}
  </PageLayout>
);

export default ApplicationSummary;
