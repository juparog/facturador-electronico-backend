import nodemailer from 'nodemailer';
import { configEnv } from '../env/config';

const transporter = nodemailer.createTransport({
  service: configEnv.get('smtp.service'),
  host: configEnv.get('smtp.host'),
  auth: {
    user: configEnv.get('smtp.user'),
    pass: configEnv.get('smtp.password'),
  },
});

export { transporter };
