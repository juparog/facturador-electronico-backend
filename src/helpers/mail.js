// import Email from 'email-templates';
// import path from 'path';
// import { transporter } from '../config/mail/mailerConfig';
// import { configEnv } from '../config/env/config';
// import { logger } from './console';

// const sendEmailForgotPassword = async (user, passwordResetToken) => {
//   logger.info(' ::: helpers.mail.sendEmailForgotPassword');
//   const emailTemplatePath = path.join(__dirname, '../emails/resetPassword');
//   const email = new Email({
//     message: {
//       from: `"${configEnv.get('app.name')}" <${configEnv.get('smtp.user')}>`,
//     },
//     // send true para enviar correos electrónicos en el entorno de desarrollo / prueba:
//     send: true,
//     transport: transporter,
//   });
//   logger.info(
//     ' ::: helpers.mail.sendEmailForgotPassword: Enviando el correo...'
//   );
//   email
//     .send({
//       template: emailTemplatePath,
//       message: {
//         to: user.email,
//       },
//       locals: {
//         appName: configEnv.get('app.name'),
//         name: user.firstName,
//         link: `${configEnv.get('app.urlClient')}/${configEnv.get(
//           'smtp.pathResetPassword'
//         )}/${passwordResetToken}`,
//       },
//     })
//     .then(() => logger.info(
//       ' ::: helpers.mail.sendEmailForgotPassword: Se envió el correo electronico.'
//     ))
//     .catch((err) => logger.error(
//       ' ::: helpers.mail.sendEmailForgotPassword: Error enviando el correo, ',
//       err
//     ));
// };

import sgMail from '@sendgrid/mail';
import { logger } from './console';
import { configEnv } from '../config/env/config';

const sgMailApiKey = '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';
sgMail.setApiKey(sgMailApiKey);

const sendEmailForgotPassword = async (user, passwordResetToken) => {
  logger.info(' ::: helpers.mail.sendEmailForgotPassword');
  const msg = {
    to: user.email,
    from: {
      name: configEnv.get('app.name'),
      email: configEnv.get('smtp.user')
    },
    templateId: configEnv.get('smtp.templateId'),
    dynamic_template_data: {
      name: user.firstName,
      link: `${configEnv.get('app.url')}/${configEnv.get(
        'smtp.pathResetPassword'
      )}/${passwordResetToken}`,
      date: new Date()
    }
  };
  sgMail
    .send(msg)
    .then(() => logger.info(
      ' ::: helpers.mail.sendEmailForgotPassword: Se envió el correo electronico.'
    ))
    .catch((err) => logger.error(
      ' ::: helpers.mail.sendEmailForgotPassword: Error enviando el correo, ',
      err
    ));
};

export { sendEmailForgotPassword };
