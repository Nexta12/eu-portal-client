import React from 'react';
import { BsTable } from 'react-icons/bs';
import { Button } from 'antd';
import { Report, SupportTicketStatus } from '@customTypes/tickets';
import { formatDate } from '@utils/helpers';
import styles from './Ticket.module.scss';
import { TicketInfoItem } from './TicketInfoItem';
import { TicketStatus } from './TicketStatus';

interface TicketInfoSectionProps {
  ticket: Report | undefined;
  isClosing: boolean;
  scrollToForm: () => void;
  handleClosed: () => Promise<void>;
}

export const TicketInfoSection: React.FC<TicketInfoSectionProps> = ({
  ticket,
  isClosing,
  scrollToForm,
  handleClosed
}) => (
  <div className={styles.messagesRight}>
    <h2 className={styles.title}>
      <BsTable className={styles.icon} /> Ticket Information
    </h2>
    <TicketInfoItem title="TicketNo:" value={`#-${ticket?.ticketNo}`} />
    <TicketInfoItem title="Subject:" value={ticket?.subject} />
    <TicketInfoItem
      title="Submitted By:"
      value={`${ticket?.student.firstName} ${ticket?.student.lastName}`}
    />
    <TicketStatus status={ticket?.status} />
    <TicketInfoItem title="Last updated:" value={formatDate(ticket?.updatedAt || '')} />
    {ticket?.status !== SupportTicketStatus.CLOSED && (
      <div className={styles.itemBodyBtn}>
        <Button type="primary" size="large" className="mt-2" block onClick={scrollToForm}>
          Reply
        </Button>
        <Button
          type="default"
          size="large"
          className="mt-2"
          block
          loading={isClosing}
          onClick={handleClosed}
        >
          Mark Closed
        </Button>
      </div>
    )}
  </div>
);
