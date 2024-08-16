import React from 'react';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { AccountBalance } from '@customTypes/finance';
import { SuccessResponse } from '@customTypes/general';
import { StudentProfile } from '@customTypes/user';
import useAuthStore from '@store/authStore';
import { formatNaira } from '@utils/currencyFormatter';

export const UserIntroSection = () => {
  const { user } = useAuthStore();
  const userId = user?.userId;
  const { data: profile } = useSWR(`${endpoints.students}/${userId}`, async (url: string) => {
    const response = await apiClient.get<SuccessResponse<StudentProfile>>(url);
    return response.data.data;
  });

  const { data: balanceInfo } = useSWR(endpoints.getBalance, async (url) => {
    const response = await apiClient.get<AccountBalance>(url);
    return response.data;
  });

  const loggedInUser = {
    name: user ? `${user.firstName} ${user.lastName}` : 'No Name',
    userId: user ? `user${user.userId}` : 'No ID',
    balance: balanceInfo?.balance || 0,
    matriculationNumber: profile ? `${profile?.matriculationNumber}` : 'No Matriculation No'
  };

  return (
    <div>
      <div className="mb-1">{loggedInUser.name}</div>
      <div className="font-weight-bold">
        {loggedInUser.matriculationNumber} | {formatNaira.format(loggedInUser.balance)}
      </div>
    </div>
  );
};

export const UserIntroSectionMini = () => {
  const { user } = useAuthStore();

  return <div className="mb-1">{user ? `${user.firstName} ${user.lastName}` : 'No Name'}</div>;
};
