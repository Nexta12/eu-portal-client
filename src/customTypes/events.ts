export interface Author {
    firstName: string;
    lastName: string;
}
export interface Event {
    id: string;
    title: string;
    description: string;
    focus: string;
    author: Author;
    eventDate: Date | string;
    createdAt: Date | string;
}
export interface MappedEvent {
    key: string;
    sn: number;
    title: string;
    author: string;
    focus: string;
    eventDate: string;
    createdAt: string;
    actions: JSX.Element;
}
