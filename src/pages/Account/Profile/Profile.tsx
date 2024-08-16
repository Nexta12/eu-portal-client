import React from 'react';
import { Col, Row } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { CardSkeleton, TextSkeleton } from '@components/Skeleton';
import { Programme } from '@customTypes/courses';
import { AccountBalance } from '@customTypes/finance';
import { SuccessResponse } from '@customTypes/general';
import { StudentProfile } from '@customTypes/user';
import { admissionStatusTag } from '@pages/Staff/Admission/Admissions';
import useAuthStore from '@store/authStore';
import { PersonalInformation } from './PersonalInformation';
import { ProfileCard } from './ProfileCard';

const Profile = () => {
  const { user } = useAuthStore();
  const userId = user?.userId;

  const { data: profile } = useSWR(`${endpoints.students}/${userId}`, async (url: string) => {
    const response = await apiClient.get<SuccessResponse<StudentProfile>>(url);
    return response.data.data;
  });

  const { data: balance } = useSWR(endpoints.getBalance, async (url) => {
    const response = await apiClient.get<AccountBalance>(url);
    return response.data?.balance;
  });

  return (
    <DashboardContentLayout title="Profile">
      <div className="d-flex align-items-center gap-1">
        {profile ? (
          <h1>
            {profile?.firstName} {profile?.middleName} {profile?.lastName}
          </h1>
        ) : (
          <TextSkeleton width="50vw" />
        )}
        <div className="mb-1">
          {profile?.admissionStatus && admissionStatusTag[profile.admissionStatus]}
        </div>
      </div>
      {profile ? (
        <div className="d-flex">
          <div className="font-weight-bold">{(profile?.programme as Programme)?.name} </div>
        </div>
      ) : (
        <TextSkeleton width="40vw" />
      )}
      {profile ? (
        <Row gutter={[24, 24]} className="mt-5">
          <Col xs={24} lg={8}>
            <ProfileCard
              image={profile?.document?.picture}
              cohort={profile?.cohort}
              matricNumber={profile?.matriculationNumber}
              course={profile?.cohort}
              balance={balance}
            />
          </Col>
          <Col xs={24} lg={16}>
            <PersonalInformation
              email={profile?.email}
              address={profile?.address}
              birthday={profile?.dateOfBirth?.toString()}
              country={profile?.country}
              gender={profile?.gender}
              postalCode={profile?.zipCode}
              telephone={profile?.phoneNumber}
              city={profile?.city}
              employmentStatus={profile?.employmentStatus}
              level={profile?.level}
            />
          </Col>
        </Row>
      ) : (
        <CardSkeleton number={2} widths={[null, 600]} />
      )}
    </DashboardContentLayout>
  );
};

export default Profile;
