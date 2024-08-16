import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PageLayout } from '@components/Layout';
import styles from './NotFound.module.scss';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageLayout siteTitle="Not Found">
      <div className={styles.section}>
        <h1 className={styles.error}>404</h1>
        <div className={styles.page}>Ooops!!! The page you are looking for is not found</div>
        <Button type="primary" className={styles.backHome} onClick={() => navigate('/')}>
          Back to home
        </Button>
      </div>
    </PageLayout>
  );
};

export default NotFound;
