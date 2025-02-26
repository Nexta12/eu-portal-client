import React from 'react';
import { SupportTicketStatus } from '@customTypes/tickets';
import { getStatusClass } from '@utils/helpers';
import styles from './Ticket.module.scss';

interface TicketStatusProps {
  status: SupportTicketStatus | undefined;
}

export const TicketStatus: React.FC<TicketStatusProps> = ({ status }) => (
  <div className={styles.itemBody}>
    <p className={styles.headerTitle}>Status:</p>
    <p
      className={`${styles.headerValue} ${styles.statusbtn} ${getStatusClass(styles, status)}`}
      title={
        status === SupportTicketStatus.AWAITING_STUDENT_REPLY
          ? 'Awaiting Student Reply'
          : status === SupportTicketStatus.AWAITING_ADMIN_REPLY
          ? 'Awaiting Admin Reply'
          : status === SupportTicketStatus.CLOSED
          ? 'Ticket Closed'
          : status === SupportTicketStatus.OPEN
          ? 'Ticket is open'
          : ''
      }
    >
      {status}
    </p>
  </div>
);
