export interface CalendarItem {
    title: string;
    color: string;
    start: Date;
    end: Date;
    tenative: boolean;
    description?: string;
    link?: string;
}