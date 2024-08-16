import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { paths } from '@routes/paths';
import useAuthStore from '@store/authStore';
import { getLocalStorageItem } from '@utils/localStorage';

export const PrivateRoute = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getLocalStorageItem('token');
    if (!token && !isAuthenticated) {
      logout();
      navigate(paths.login);
    }
  }, [isAuthenticated, logout, navigate]);

  return <Outlet />;
};
