import React from 'react';
import { Alert, Button, Card, FormInstance } from 'antd';
import { FormWrapper } from '@components/Form';
import { TextEditor } from '@components/TextEditor';
import { AlertMessage } from '@customTypes/general';
import { Report, ReportConversations } from '@customTypes/tickets';
import { ReportMessage } from './ReportMessage';
import styles from './Ticket.module.scss';
import { TicketMessage } from './TicketMessage';

interface MessagesSectionProps {
  ticket: Report | undefined;
  reportConversations: ReportConversations[] | undefined;
  error: Error | null;
  message: AlertMessage;
  setMessage: React.Dispatch<React.SetStateAction<AlertMessage>>;
  formRef: React.RefObject<HTMLDivElement>;
  handleOnFinish: () => Promise<void>;
  replyMessage: string;
  setReplyMessage: React.Dispatch<React.SetStateAction<string>>;
  form: FormInstance;
  isMutating: boolean;
}

export const MessagesSection: React.FC<MessagesSectionProps> = ({
  ticket,
  reportConversations,
  error,
  message,
  setMessage,
  formRef,
  handleOnFinish,
  replyMessage,
  setReplyMessage,
  form,
  isMutating
}) => (
  <div className={styles.messagesLeft}>
    <TicketMessage ticket={ticket} />
    {reportConversations?.map((report) => (
      <ReportMessage report={report} key={report?.id} />
    ))}
    {(message.success || message.error || error) && (
      <Alert
        type={message.error ? 'error' : 'success'}
        message={message.error ?? message.success}
        className="width-100"
        closable
        onClose={() => setMessage({ error: null, success: null })}
      />
    )}
    <Card className="width-100 p-1" ref={formRef}>
      <FormWrapper className="d-flex flex-direction-column" onFinish={handleOnFinish} form={form}>
        <TextEditor
          placeholder="Write something..."
          label="Send a reply"
          value={replyMessage}
          onChange={setReplyMessage}
        />
        <Button
          type="primary"
          size="large"
          className="mt-2"
          block
          htmlType="submit"
          loading={isMutating}
        >
          Post a reply
        </Button>
      </FormWrapper>
    </Card>
  </div>
);
