import nodemailer from 'nodemailer';
import { env } from '../config/env';

// This is a placeholder. User would need to provide SMTP credentials in .env
// For now, we use a mock transporter or etherial for dev
export const sendEmail = async (options: { email: string; subject: string; message: string }) => {
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // });

  // const message = {
  //   from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.message,
  // };

  // const info = await transporter.sendMail(message);
  // console.log('Message sent: %s', info.messageId);
  
  console.log(`Email simulated to ${options.email}: ${options.subject}`);
};
