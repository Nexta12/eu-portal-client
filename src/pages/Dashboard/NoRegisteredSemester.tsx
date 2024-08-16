import React, { Dispatch, SetStateAction } from 'react';
import { VscEmptyWindow } from 'react-icons/vsc';
import { Button } from 'antd';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { AlertMessage } from '@customTypes/general';
import { colorPrimary } from '@styles/theme';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import useSWRMutation from 'swr/mutation';

interface EmptyContentProps {
  setMessage: Dispatch<SetStateAction<AlertMessage>>;
}

const NoRegisteredSemester = ({ setMessage }: EmptyContentProps) => {
  const { trigger, isMutating } = useSWRMutation('semesterRegistration', async () => {
    const response = await apiClient.post(endpoints.semesterRegistration);
    return response.data;
  });

  const handleSemesterRegistration = async () => {
    try {
      await trigger();
      setMessage({ error: null, success: 'Semester registration successful' });
    } catch (err) {
      setMessage({ error: formatErrors(getAxiosError(err).errorData), success: null });
    }
  };

  return (
    <div className="d-flex flex-direction-column align-items-center">
      <VscEmptyWindow size={150} color={colorPrimary} />
      <div className="font-larger font-weight-bold mt-2">
        You have not registered for any semester yet
      </div>
      <Button
        type="primary"
        className="mt-4"
        size="large"
        onClick={handleSemesterRegistration}
        loading={isMutating}
      >
        Register for semester
      </Button>
    </div>
  );
};

export default NoRegisteredSemester;
