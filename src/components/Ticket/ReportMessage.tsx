import React from 'react';
import { ReportConversations } from '@customTypes/tickets';
import { formatDate } from '@utils/helpers';
import userImage from '../../pages/Blog/user-img.png';
import styles from './Ticket.module.scss';

interface ReportMessageProps {
  report: ReportConversations;
}
export const ReportMessage: React.FC<ReportMessageProps> = ({ report }) => (
  <div className={styles.reportMessages} key={report?.id}>
    <div className={styles.messagesWrapper}>
      <div className={styles.messagesTop}>
        <div className={styles.left}>
          <img className={styles.userImage} src={userImage} alt="User" />
          <span>
            {report.admin
              ? `${report.admin.firstName} ${report.admin.lastName}`
              : `${report?.student?.firstName} ${report?.student?.lastName}`}
          </span>
        </div>
        <div className={styles.right}>{formatDate(report?.createdAt || '')}</div>
      </div>
      <div className={`${styles.messagesBottom} ${report.admin ? styles.admin : ''}`}>
        {report?.message}
      </div>
    </div>
  </div>
);
