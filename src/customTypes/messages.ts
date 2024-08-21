export interface ContactMessages {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    message?: string;
    reply?: string;
    snippet?: string;
    createdAt: Date | string;
    createdBy: string;
}
