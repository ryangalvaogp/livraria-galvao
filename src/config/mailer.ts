import nodemailer from 'nodemailer';
import {config} from 'dotenv';
config();

export const transport = nodemailer.createTransport({
    //@ts-ignore
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  },);
