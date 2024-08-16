import React from 'react';
import { Report } from '@customTypes/tickets';
import { formatDate } from '@utils/helpers';
import userImage from '../../pages/Blog/user-img.png';
import styles from './Ticket.module.scss';

interface TicketMessageProps {
  ticket: Report | undefined;
}

export const TicketMessage: React.FC<TicketMessageProps> = ({ ticket }) => (
  <div className={styles.reportMainMessage}>
    <div className={styles.messagesWrapper}>
      <div className={styles.messagesTop}>
        <div className={styles.left}>
          <img className={styles.userImage} src={userImage} alt="User" />
          <span>
            {ticket?.student.firstName} {ticket?.student.lastName}
          </span>
        </div>
        <div className={styles.right}>{formatDate(ticket?.createdAt || '')}</div>
      </div>
      <div className={`${styles.messagesBottom} ${styles.student}`}>{ticket?.message}</div>
    </div>
  </div>
);
