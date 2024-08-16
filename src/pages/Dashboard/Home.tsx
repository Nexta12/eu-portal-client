import React, { useEffect, useState } from 'react';
import { Alert, Col, Row } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { CardSkeleton } from '@components/Skeleton';
import { Academics } from '@customTypes/courses';
import { AlertMessage } from '@customTypes/general';
import { AcademicsCard } from '@pages/Dashboard/AcademicsCard';
import NoRegisteredSemester from '@pages/Dashboard/NoRegisteredSemester';
import useAuthStore from '@store/authStore';
import { dummyCoursesToTake, dummyStatisticsCards, dummyTestToTake } from '@utils/data';
import Styles from './Dashboard.module.scss';
import { Notification, NotificationCard } from './NotificationCard';
import { StatisticsCard } from './StatisticsCard';

const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);

const StatisticsCardList = () => (
  <div>
    <div className={Styles.gridColumn3}>
      {dummyStatisticsCards &&
        dummyStatisticsCards.map(({ title, icon, value, description }, index) => (
          <StatisticsCard
            key={index}
            title={title}
            value={value}
            description={description}
            Icon={icon}
          />
        ))}
    </div>
    {!dummyStatisticsCards && <CardSkeleton number={3} />}
  </div>
);

const AcademicsCardList = () => (
  <div className={Styles.gridColumn2}>
    <AcademicsCard heading="Learning Progress" courses={dummyCoursesToTake} />
    <AcademicsCard heading="Pending Tasks" courses={dummyTestToTake} />
  </div>
);

const Home = () => {
  const { user } = useAuthStore();
  const [currentSemester, setCurrentSemester] = useState<Academics | null>(null);
  const { data, isLoading, error } = useSWR(endpoints.currentSemester, fetcher);
  const [message, setMessage] = useState<AlertMessage>({ error: null, success: null });

  useEffect(() => {
    setCurrentSemester(data || null);
  }, [data, error, isLoading]);

  const name = user ? `${user.firstName} ${user.lastName}` : '';

  const {
    data: notificationsData,
    error: notificationsError,
    isLoading: isNotificationsLoading
  } = useSWR<Notification[]>(endpoints.getNotifications, fetcher);

  return (
    <DashboardContentLayout title={name} preTitle="Welcome">
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
        <Row gutter={[24, 24]} className="w-100">
          <Col xs={24} md={24} lg={18}>
            <StatisticsCardList />
            <AcademicsCardList />
          </Col>
          <Col xs={24} md={24} lg={6}>
            {isNotificationsLoading ? (
              <CardSkeleton number={3} />
            ) : notificationsError ? (
              <Alert type="error" message="Failed to load notifications" />
            ) : (
              <NotificationCard heading="Notification" notifications={notificationsData || []} />
            )}
          </Col>
        </Row>
      ) : isLoading ? (
        <CardSkeleton number={6} />
      ) : (
        <NoRegisteredSemester setMessage={setMessage} />
      )}
    </DashboardContentLayout>
  );
};

export default Home;
