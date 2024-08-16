import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { LargerButton } from '@components/Button';
import { DashboardContentLayout } from '@components/Layout';
import { CustomModal } from '@components/Modal';
import { AntTable } from '@components/Table';
import { AntTag } from '@components/Tag';
import { CurrentSemester, SemesterCourse } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import AcademicsSummaryCard from '@pages/Courses/AcademicsSummaryCard';
import NoRegisteredSemester from '@pages/Dashboard/NoRegisteredSemester';
import { DOLLAR_TO_NAIRA } from '@utils/constants';
import { formatNaira, formatUSDollar } from '@utils/currencyFormatter';
import { formatErrors } from '@utils/errorFormatter';
import { getAxiosError } from '@utils/http';
import { ColumnsType } from 'antd/es/table';
import useSWRMutation from 'swr/mutation';

type PreRegistrationType = Pick<SemesterCourse, 'name' | 'code' | 'unit' | 'costUsd'> & {
  isCompulsory: boolean;
};

const columns: ColumnsType<PreRegistrationType> = [
  {
    title: 'S/No',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'Course Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Course Code',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: 'Course Unit',
    dataIndex: 'unit',
    key: 'unit'
  },
  {
    title: 'Cost (USD)',
    dataIndex: 'costUsd',
    key: 'costUsd',
    render: (costUsd: number) => formatUSDollar.format(costUsd)
  },
  {
    title: 'Cost (NGN)',
    dataIndex: 'costNgn',
    key: 'costNgn',
    render: (costNgn: number) => formatNaira.format(costNgn)
  },
  {
    title: 'Compulsory',
    dataIndex: 'isCompulsory',
    key: 'isCompulsory',
    render: (isCompulsory: boolean) =>
      isCompulsory ? <AntTag color="green" text="Yes" /> : <AntTag color="red" text="No" />
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action'
  }
];

type PreRegistrationSummary = {
  totalUnits: number;
  totalCostUsd: number;
  totalNumberOfCourses: number;
};

type UpdateCourseRegistration = {
  academicSessionId?: string;
  courses?: SemesterCourse[];
};

const getRegistrationSummary = (courses: SemesterCourse[]): PreRegistrationSummary =>
  courses?.reduce(
    (acc, course) => {
      if (course.isEnrolled) {
        acc.totalUnits += course.unit;
        acc.totalCostUsd += course.costUsd;
        acc.totalNumberOfCourses += 1;
      }
      return acc;
    },
    { totalUnits: 0, totalCostUsd: 0, totalNumberOfCourses: 0 }
  );

const getUnEnrolledCourses = (courses: SemesterCourse[]) =>
  courses.filter(({ isEnrolled }) => !isEnrolled);

const defaultRegistrationSummary = {
  totalUnits: 0,
  totalCostUsd: 0,
  totalNumberOfCourses: 0
};

const PreRegistration = () => {
  const { data, isLoading, mutate } = useSWR(endpoints.currentSemester, async (url: string) => {
    const response = await apiClient.get<CurrentSemester>(url);
    return response.data;
  });

  const { trigger: triggerCourseRegistration, isMutating } = useSWRMutation(
    endpoints.courseRegistration,
    async (url: string, { arg }: { arg: UpdateCourseRegistration }) => {
      const response = await apiClient.put(url, arg);
      return response.data;
    }
  );

  const [registrationSummary, setRegistrationSummary] = useState<PreRegistrationSummary>(
    defaultRegistrationSummary
  );

  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });
  const [currentSemester, setCurrentSemester] = useState<CurrentSemester | null>(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleEnrollment = useCallback(
    (semesterCourseId: string) => {
      const courses = currentSemester?.courses;
      const updatedCourses =
        courses?.map((course) => {
          if (course.semesterCourseId === semesterCourseId) {
            return { ...course, isEnrolled: !course.isEnrolled };
          }
          return course;
        }) || [];
      setCurrentSemester({ ...currentSemester, courses: updatedCourses } as CurrentSemester);
      setRegistrationSummary(getRegistrationSummary(updatedCourses));
    },
    [currentSemester]
  );

  useEffect(() => {
    if (!currentSemester && data) {
      setCurrentSemester({ ...data, courses: getUnEnrolledCourses(data.courses) });
    }
  }, [currentSemester, data]);

  const submitCourseRegistration = async () => {
    try {
      setOpenConfirmationModal(false);
      const enrolledCourses = currentSemester?.courses.filter(({ isEnrolled }) => isEnrolled);
      await triggerCourseRegistration({
        academicSessionId: currentSemester?.id,
        courses: enrolledCourses
      });

      await mutate();
      setCurrentSemester({
        ...data,
        courses: getUnEnrolledCourses(currentSemester?.courses || [])
      } as CurrentSemester);
      setRegistrationSummary(defaultRegistrationSummary);
      setMessage({
        error: null,
        success:
          'Course registration successful. Please proceed to make payment for the registered courses'
      });
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (err) {
      const axiosError = getAxiosError(err);
      setMessage({ error: formatErrors(axiosError.errorData), success: null });
    }
  };

  const courses = useMemo(
    () =>
      currentSemester?.courses.map(
        ({ semesterCourseId, name, code, unit, isCompulsory, costUsd, isEnrolled }, index) => ({
          key: `${name}${index + 1}`,
          sn: index + 1,
          name,
          code,
          unit,
          costUsd: costUsd ?? 0,
          costNgn: costUsd ? costUsd * DOLLAR_TO_NAIRA : 0,
          isCompulsory,
          action: isEnrolled ? (
            <Button type="link" onClick={() => handleEnrollment(semesterCourseId)}>
              Revert
            </Button>
          ) : (
            <Button onClick={() => handleEnrollment(semesterCourseId)}>Enrol</Button>
          )
        })
      ) || [],
    [currentSemester?.courses, handleEnrollment]
  );

  return (
    <DashboardContentLayout
      title="Pre-Registration"
      description="This is the list of courses you are to register for this semester"
      className="mb-2 w-100"
    >
      {(message.success || message.error) && (
        <Alert
          type={message.error ? 'error' : 'success'}
          message={message.error ?? message.success}
          className="width-100 mb-2"
          closable
          onClose={() => setMessage({ error: null, success: null })}
        />
      )}
      {currentSemester ? (
        <div className="w-100">
          <AcademicsSummaryCard
            cohort={currentSemester?.cohort}
            semester={currentSemester?.semester}
            level={currentSemester?.level}
            programme={currentSemester?.programme}
          />
          <AntTable
            columns={columns}
            dataSource={courses}
            loading={isLoading}
            emptyText="Student does not have any courses available for pre-registration"
          />
          <div className="mt-2 w-100 d-flex flex-direction-column align-items-end pr-2">
            <div>
              <div className="font-weight-bold font-semi-large mb-2">
                Total Units: {registrationSummary.totalUnits} units
              </div>
              <div className="font-weight-bold font-semi-large mb-1">
                Total Cost: {formatUSDollar.format(registrationSummary.totalCostUsd)}
              </div>
            </div>
            {registrationSummary.totalNumberOfCourses > 0 && (
              <LargerButton
                size="large"
                type="primary"
                className="mt-1"
                onClick={() => setOpenConfirmationModal(true)}
                loading={isMutating}
              >
                Enrol ({registrationSummary.totalNumberOfCourses} Courses)
              </LargerButton>
            )}
          </div>
        </div>
      ) : (
        <NoRegisteredSemester setMessage={setMessage} />
      )}
      <CustomModal
        title="Confirm"
        open={openConfirmationModal}
        onOk={submitCourseRegistration}
        onCancel={() => setOpenConfirmationModal(false)}
        type="warning"
        confirmLoading={isMutating}
      >
        <div>
          <div>
            You are about to enrol for {registrationSummary.totalNumberOfCourses} courses. Are you
            sure you want to proceed?
          </div>
          <div className="font-weight-bolder mt-1">
            Note: You will not be able to revert this action.
          </div>
        </div>
      </CustomModal>
    </DashboardContentLayout>
  );
};

export default PreRegistration;
