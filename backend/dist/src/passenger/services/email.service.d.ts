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
    sendPasswordReset(to: string, resetToken: string): Promise<boolean>;
}
