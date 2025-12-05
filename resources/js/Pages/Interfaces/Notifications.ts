export interface Notification {
    id: string;
    data: {
        title: string;
        message: string;
        url: string;
        // read_at: Date;
    }
    read_at?: string;
    created_at?: string;
}
