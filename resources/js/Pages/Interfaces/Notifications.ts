export interface Notification {
    id: string;
    data: {
        title: string;
        message: string;
        url: string;
        read_at: Date; 
    }
}
