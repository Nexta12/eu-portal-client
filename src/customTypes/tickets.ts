export interface Student {
    firstName: string;
    lastName: string;
    userId: string;
}
export interface Report {
    id: string;
    subject: string;
    message: string;
    snippet: string;
    ticketNo: string;
    student: Student;
    status: SupportTicketStatus;
    createdAt: Date | string;
    updatedAt: Date | string;
}
export interface MessageAuthor {
    firstName: string;
    lastName: string;
    userId: string;
}
export interface ReportConversations {
    id: string;
    message: string;
    author: MessageAuthor;
    admin: MessageAuthor | null;
    student: MessageAuthor | null;
    reportId: string;
    createdAt: Date | string;
}
export interface MappedReport {
    key: string;
    sn: number;
    ticketNo: string;
    subject: string;
    snippet: string;
    student: string
    status: string;
    createdAt: string;
    actions: JSX.Element;
}

export enum SupportTicketStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    AWAITING_STUDENT_REPLY = 'ASR',
    AWAITING_ADMIN_REPLY = 'ADR'
}