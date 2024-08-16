import React from 'react';
import { ConfigProvider } from 'antd';
import { AppRoutes } from '@routes/AppRoutes';
import { defaultTheme } from '@styles/theme';

const App = () => (
  <ConfigProvider theme={defaultTheme}>
    <AppRoutes />
  </ConfigProvider>
);

export default App;
