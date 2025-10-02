import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    private createTransporter;
    sendTicketConfirmation(to: string, ticketDetails: {
        ticketId: string;
        journeyDate: Date;
        destination: string;
        seatNumber: string;
    }): Promise<boolean>;
    sendMultipleTicketConfirmation(to: string, bookingDetails: {
        bookingGroupId: string;
        tickets: Array<{
            ticketId: string;
            seatNumber: string;
            price: number;
        }>;
        journeyDate: Date;
        destination: string;
        totalPrice: number;
        seatCount: number;
    }): Promise<boolean>;
    sendPasswordReset(to: string, resetToken: string): Promise<boolean>;
}
