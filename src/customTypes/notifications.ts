export interface CreatedBy {
    firstName: string;
    lastName: string;
}
export interface Notifications {
    id: string;
    title: string;
    message: string;
    level: string;
    author: CreatedBy;
    createdAt: Date | string;
}
export interface MappedNotification {
    key: string;
    sn: number;
    title: string;
    author: string;
    message: string;
    createdAt: string;
    actions: JSX.Element;
}
