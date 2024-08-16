import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Footer } from '@components/Footer';
import { PageHeader } from '@components/Header';
import useAuthStore, { getLoginPath } from '@store/authStore';

const LandingPageOutlet = () => {
  const { isAuthenticated, validateAuth, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    validateAuth();
    if (isAuthenticated && user) {
      navigate(getLoginPath(user));
    }
  }, [isAuthenticated, navigate, user, validateAuth]);

  return (
    <>
      <PageHeader />
      <Outlet />
      <Footer />
    </>
  );
};

export default LandingPageOutlet;
