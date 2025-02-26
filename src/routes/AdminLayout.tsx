import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { paths } from '@routes/paths';
import useAuthStore, { getLoginPath } from '@store/authStore';
import { getLocalStorageItem } from '@utils/localStorage';

export const AdminLayout = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    const token = getLocalStorageItem('token');
    if (!token && !isAuthenticated) {
      logout();
      navigate(paths.login);
    }
  }, [isAuthenticated, logout, navigate]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate(getLoginPath(user));
    }
  }, [user, navigate]);

  return <Outlet />;
};
