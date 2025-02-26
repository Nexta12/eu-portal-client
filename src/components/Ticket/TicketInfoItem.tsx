import React from 'react';
import styles from './Ticket.module.scss';

interface TicketInfoItemProps {
  title: string;
  value: string | undefined;
}

export const TicketInfoItem: React.FC<TicketInfoItemProps> = ({ title, value }) => (
  <div className={styles.itemBody}>
    <p className={styles.headerTitle}>{title}</p>
    <p className={styles.headerValue}>{value}</p>
  </div>
);
