import React from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { DashboardContentLayout } from '@components/Layout';

const ApplicationComplete = () => (
  <DashboardContentLayout title="Application Complete">
    <div className="d-flex flex-direction-column gap-1 align-items-center justify-content-center">
      <BsCheckCircleFill size={100} className="text-color-success" />
      <div className="font-larger mt-2">
        Application has been completed. Please wait for us to review it.
      </div>
      <div className="font-large mt-1">Best Regards! 👋</div>
    </div>
  </DashboardContentLayout>
);

export default ApplicationComplete;
