import { transporter } from '../config/mail/mailerConfig';
import { configEnv } from '../config/env/config';

const sendEmailForgotPassword = async (receiver) => {
  const mailOptions = {
    from: `"${configEnv.get('app.name')}" <${configEnv.get('smtp.user')}>`,
    to: receiver,
    subject: '🔐 Reset Password Email',
    text: 'Ha solicitado restablecer la contraseña',
    html: `<a href="javascript:void(0);"
    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
    Password</a>`,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    return console.log(`Message sent: ${info.response}`);
  });
};

export { sendEmailForgotPassword };
