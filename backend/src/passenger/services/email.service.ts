import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Initialize email service
    this.createTransporter();
  }

  private async createTransporter() {
    try {
      const emailUser = this.configService.get('EMAIL_USER');
      const emailPass = this.configService.get('EMAIL_PASSWORD');

      // Only create transporter if email credentials are provided
      if (!emailUser || !emailPass) {
        console.log('Email credentials not configured. Email service will be disabled.');
        return;
      }

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      // Verify the connection (but don't fail if it fails)
      await this.transporter.verify();
      console.log('SMTP connection established successfully');
    } catch (error) {
      console.error('Error creating email transporter:', error);
      console.log('Email service will continue without SMTP verification');
      // Don't throw the error, just log it
    }
  }

  async sendTicketConfirmation(
    to: string,
    ticketDetails: {
      ticketId: string;
      journeyDate: Date;
      destination: string;
      seatNumber: string;
    },
  ) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Bus Ticket Confirmation',
      html: `
        <h1>Ticket Confirmation</h1>
        <p>Dear Passenger,</p>
        <p>Your bus ticket has been confirmed. Here are the details:</p>
        <ul>
          <li>Ticket ID: ${ticketDetails.ticketId}</li>
          <li>Journey Date: ${new Date(ticketDetails.journeyDate).toLocaleDateString()}</li>
          <li>Destination: ${ticketDetails.destination}</li>
          <li>Seat Number: ${ticketDetails.seatNumber}</li>
        </ul>
        <p>Thank you for choosing our service!</p>
      `,
    };

    try {
      if (!this.transporter) {
        console.log('Email service not configured. Skipping ticket confirmation email.');
        return false;
      }

      console.log('Attempting to send ticket confirmation email with options:', {
        to: mailOptions.to,
        from: mailOptions.from,
        subject: mailOptions.subject
      });
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Ticket confirmation email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Error sending ticket confirmation email - Full error:', error);
      console.error('Email configuration:', {
        user: process.env.EMAIL_USER,
        error: error.message,
        code: error.code,
        command: error.command
      });
      return false;
    }
  }

  async sendMultipleTicketConfirmation(
    to: string,
    bookingDetails: {
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
    },
  ) {
    const ticketRows = bookingDetails.tickets
      .map(ticket => 
        `<tr>
          <td>${ticket.ticketId}</td>
          <td>${ticket.seatNumber}</td>
          <td>৳${ticket.price}</td>
        </tr>`
      )
      .join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Multiple Bus Tickets Confirmation',
      html: `
        <h1>Multiple Tickets Booking Confirmation</h1>
        <p>Dear Passenger,</p>
        <p>Your bus tickets have been confirmed. Here are the details:</p>
        
        <div style="margin: 20px 0;">
          <strong>Booking Group ID:</strong> ${bookingDetails.bookingGroupId}<br>
          <strong>Journey Date:</strong> ${new Date(bookingDetails.journeyDate).toLocaleDateString()}<br>
          <strong>Route:</strong> ${bookingDetails.destination}<br>
          <strong>Total Seats:</strong> ${bookingDetails.seatCount}<br>
        </div>

        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px;">Ticket ID</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Seat Number</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${ticketRows}
          </tbody>
        </table>
        
        <div style="margin: 20px 0; font-size: 18px; font-weight: bold;">
          <strong>Total Amount: ৳${bookingDetails.totalPrice}</strong>
        </div>
        
        <p>Please keep this confirmation for your records.</p>
        <p>Thank you for choosing our service!</p>
      `,
    };

    try {
      if (!this.transporter) {
        console.log('Email service not configured. Skipping multiple ticket confirmation email.');
        return false;
      }

      console.log('Attempting to send multiple ticket confirmation email with options:', {
        to: mailOptions.to,
        from: mailOptions.from,
        subject: mailOptions.subject
      });
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Multiple ticket confirmation email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Error sending multiple ticket confirmation email - Full error:', error);
      return false;
    }
  }

  async sendPasswordReset(to: string, resetToken: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You have requested to reset your password. Click the link below to proceed:</p>
        <p>
          <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    try {
      if (!this.transporter) {
        console.log('Email service not configured. Skipping password reset email.');
        return false;
      }

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}
