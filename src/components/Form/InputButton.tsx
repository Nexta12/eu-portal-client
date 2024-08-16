import React from 'react';
import { Button, Input, Space } from 'antd';
import styles from './FormField.module.scss';

export const InputButton = () => (
  <Space.Compact className={styles.inputButtonCompact}>
    <Input placeholder="Email" className={styles.inputField} />
    <Button type="primary" className={styles.inputButton}>
      Submit
    </Button>
  </Space.Compact>
);
