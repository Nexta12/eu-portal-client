export interface Staff {
    firstName: string;
    lastName: string;
    userId: string;
}
export interface Livechat {
    id: string;
    message: string;
    chatUser: {
        userId: string,
        name: string;
        email: string;
    };
    staff: Staff;
    createdAt: Date | string;
    isRead: boolean;
}