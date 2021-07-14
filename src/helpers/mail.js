import Email from 'email-templates';
import path from 'path';
import { transporter } from '../config/mail/mailerConfig';
import { configEnv } from '../config/env/config';

const sendEmailForgotPassword = async (user, passwordResetToken) => {
  const emailTemplatePath = path.join(__dirname, '../emails/resetPassword');
  const email = new Email({
    message: {
      from: `"${configEnv.get('app.name')}" <${configEnv.get('smtp.user')}>`
    },
    // send true para enviar correos electrónicos en el entorno de desarrollo / prueba:
    send: true,
    transport: transporter
  });

  email
    .send({
      template: emailTemplatePath,
      message: {
        to: user.email
      },
      locals: {
        appName: configEnv.get('app.name'),
        name: user.firstName,
        link: `${configEnv.get('app.urlClient')}/${configEnv.get('smtp.pathResetPassword')}/${passwordResetToken}`
      }
    })
    .then(console.log)
    .catch(console.error);


  // const mailOptions = {
  //   from: `"${configEnv.get('app.name')}" <${configEnv.get('smtp.user')}>`,
  //   to: receiver,
  //   subject: `🔐 Restablecer contraseña en ${configEnv.get('smtp.user')}`,
  //   text: 'Ha solicitado restablecer la contraseña',
  //   html: `<a href="javascript:void(0);"
  //   style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
  //   Password</a>`,
  // };

  // // send mail with defined transport object
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     return console.log(error);
  //   }

  //   return console.log(`Message sent: ${info.response}`);
  // });
};

export { sendEmailForgotPassword };
