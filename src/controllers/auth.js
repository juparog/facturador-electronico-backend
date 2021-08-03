import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import bcrypt from 'bcrypt';
import db from '../models';
import { logger } from '../helpers/console';
import { configEnv } from '../config/env/config';
import { sendEmailForgotPassword } from '../helpers/mail';

let refreshTokens = [];

const comparePassword = async (password, password2) => {
  logger.info(' ::: controller.authcomparePassword');
  const isSame = await bcrypt.compare(password2, password);
  logger.info(
    ` ::: controller.authcomparePassword: Contraseña comparada [${isSame}]`
  );
  return isSame;
};

const hashPassword = async (password) => {
  logger.info(' ::: controller.authhashPassword');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  logger.info(' ::: controller.authhashPassword: Contraseña encriptada');
  return hash;
};

const getToken = (payload, expiresIn = '1d') => jwt.sign(payload, configEnv.get('app.secretKey'), { expiresIn });

const verifiToken = (token) => {
  logger.info(' ::: controller.authverifiToken');
  let decoded = null;
  try {
    decoded = jwt.verify(token, configEnv.get('app.secretKey'));
  } catch (err) {
    logger.error(' ::: controller.authverifiToken: token no valido');
  }
  return decoded;
};

const login = async (req, res) => {
  logger.info(' ::: controller.auth.login');
  const { documentNumber, email, password } = req.body;

  db.User.findOne({
    where: { documentNumber, email },
  })
    .then(async (user) => {
      if (user) {
        logger.info(
          ' ::: controller.auth.login: Combinacion documentNumber/email valida.'
        );
        const isSame = await comparePassword(user.password, password);
        if (isSame) {
          logger.info(' ::: controller.auth.login: Usuario logeado!.');
          const accessToken = getToken(
            {
              user: { documentNumber: user.documentNumber, email: user.email },
            },
            configEnv.get('app.accessTokenExpirationTime')
          );
          const refreshToken = randtoken.uid(256);

          refreshTokens.push(refreshToken);

          res.status(200).json({
            accessToken,
            refreshToken,
          });
        } else {
          logger.error(' ::: controller.auth.login: Contraseña incorrecta. ');
          res.status(401).json({
            success: false,
            message: 'fallo la autenticación.',
            errors: [
              {
                name: 'password',
                message: 'Contraseña incorrecta.',
              },
            ],
          });
        }
      } else {
        logger.error(
          ' ::: controller.auth.login: documentNumber ó email incorrectos.'
        );
        res.status(401).json({
          success: false,
          message: 'fallo la autenticación.',
          errors: [
            {
              name: 'documentNumber/email',
              message: 'documentNumber ó email incorrecto.',
            },
          ],
        });
      }
    })
    .catch((err) => {
      const msg = err.message || 'No se pudo completrar la solicitud.';
      logger.error(` ::: controller.auth.login: ${msg}`);
      res.status(500).json({
        success: false,
        message: 'fallo la autenticación.',
        errors: [
          {
            name: 'server',
            message: msg,
          },
        ],
      });
    });
};

const authenticate = (req, res, next) => {
  logger.info(' ::: controller.authauthenticate');
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const accessToken = authHeader.split(' ')[1];
    const validAccessToken = verifiToken(accessToken);
    if (validAccessToken) {
      logger.info(' ::: controller.authauthenticate: Autenticacion exitosa!');

      req.user = validAccessToken.user;
      next();
    } else {
      logger.info(
        ' ::: controller.authauthenticate: El token de autenticacion no es valido'
      );
      res.status(403).json({
        message:
          'El token de autenticacion no es valido, por favor inicie sesión',
      });
    }
  } else {
    logger.error(
      ' ::: controller.authauthenticate: No se encontro el encabezado "authorization"'
    );
    res
      .status(401)
      .json({ message: 'No se encontro el encabezado "authorization"' });
  }
};

const token = (req, res) => {
  logger.info(' ::: controller.auth.token');
  const { refreshToken, documentNumber, email } = req.body;

  if (!refreshTokens.includes(refreshToken)) {
    logger.error(
      ' ::: controller.auth.token: El "refreshToken" no es valido, por favor inicie sesión.'
    );
    res.status(401).json({
      success: false,
      message: 'El "refreshToken" no es valido, por favor inicie sesión.',
      errors: [
        {
          name: 'refreshToken',
          message: 'El "refreshToken" no es valido.',
        },
      ],
    });
  }

  const accessToken = getToken({ documentNumber, email });
  logger.info(' ::: controller.auth.token: Se genero un nuevo token.');
  res.status(200).json({
    success: true,
    message: 'Se creo un nuevo token.',
    data: {
      accessToken,
    },
  });
};

const logout = (req, res) => {
  const { refreshToken } = req.body;
  
  refreshTokens = refreshTokens.filter((t) => t !== refreshToken);
  logger.info(' ::: controller.auth.token: Sesion finalizada.');
  res.status(200).json({
    success: true,
    message: 'Sesion finalizada.',
  });
};

const updatePassword = async (req, res) => {
  logger.info(' ::: controller.authupdatePassword');
  const errors = [];
  if (req.body.newPassword !== req.body.passwordconfirmation) {
    errors.push('La nueva contraseña y la de confirmación no coinciden.');
  } else {
    logger.info(
      ' ::: controller.authupdatePassword: validando la contraseña...'
    );
    let user = await db.User.findOne({
      where: req.user,
    });

    if (user) {
      user = JSON.parse(JSON.stringify(user));
      const isSame = await comparePassword(
        user.password,
        req.body.currentPassword
      );

      if (isSame) {
        req.body.newPassword = await hashPassword(req.body.newPassword);
        const num = await db.User.update(
          {
            password: req.body.newPassword,
          },
          {
            where: {
              id: req.user.id,
            },
          }
        );
        if (num[0] === 1) {
          logger.info(
            ' ::: controller.authupdatePassword: Contraseña actualizada'
          );
          res.status(200).json({
            data: {
              id: user.id,
              email: user.email,
            },
          });
        } else {
          errors.push('No se pudo encontrar el usuario en la base de datos.');
        }
      } else {
        errors.push('La contraseña actual del usuario no coincide.');
      }
    } else {
      errors.push('No se pudo recuperar los datos del usuario.');
    }
  }

  if (errors.length > 0) {
    logger.error(
      ' ::: controller.authupdatePassword: Error actualizando la contraseña: \n',
      errors
    );
    res.status(409).json({
      message: 'No se pudo actualizar la contraseña del usuario',
      errors,
    });
  }
};

const forgotPassword = async (req, res) => {
  logger.info(' ::: controller.authforgotPassword');
  const errors = [];
  let user = await db.User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    logger.info(' ::: controller.authforgotPassword: generando el token...');
    user = JSON.parse(JSON.stringify(user));
    const payloadToken = {
      user: {
        id: user.id,
        username: user.username,
      },
    };
    const passwordResetToken = getToken(payloadToken);
    logger.info(
      ' ::: controller.authforgotPassword: token generado, guardando el token...'
    );
    const num = await db.User.update(
      {
        passwordResetToken,
      },
      {
        where: {
          email: req.body.email,
        },
      }
    );
    if (num[0] === 1) {
      logger.info(' ::: controller.authforgotPassword: token guardado.');
      // enviar correo
      sendEmailForgotPassword(user, passwordResetToken);
      logger.info(' ::: controller.authforgotPassword: correo enviado.');
      res.status(200).json({
        data: {
          email: user.email,
          passwordResetToken,
        },
      });
    } else {
      errors.push('No se pudo guardar el token de recuperacion de contraseña.');
    }
  } else {
    errors.push('El email no se encuentra registrado.');
  }
  if (errors.length > 0) {
    logger.error(
      ' ::: controller.authforgotPassword: Error actualizando la contraseña: \n',
      errors
    );
    res.status(409).json({
      message: 'No se pudo realizar el proceso de recuperacion de contraseña',
      errors,
    });
  }
};

const resetPassword = async (req, res) => {
  logger.info(' ::: controller.authresetPassword');
  const errors = [];
  if (req.body.newPassword !== req.body.passwordconfirmation) {
    errors.push('La nueva contraseña y la de confirmación no coinciden.');
  } else {
    logger.info(
      ' ::: controller.authresetPassword: validando el token de acceso...'
    );
    const validAccessToken = verifiToken(req.body.passwordResetToken);
    if (!validAccessToken) {
      errors.push('El token no es valido.');
    } else {
      let user = await db.User.findOne({
        where: {
          passwordResetToken: req.body.passwordResetToken,
        },
      });

      if (user) {
        user = JSON.parse(JSON.stringify(user));

        req.body.newPassword = await hashPassword(req.body.newPassword);
        const num = await db.User.update(
          {
            password: req.body.newPassword,
            passwordResetToken: null,
          },
          {
            where: {
              id: user.id,
            },
          }
        );
        if (num[0] === 1) {
          logger.info(
            ' ::: controller.authresetPassword: Contraseña actualizada'
          );
          res.status(200).json({
            data: {
              id: user.id,
              username: user.username,
            },
          });
        } else {
          errors.push('No se pudo encontrar el usuario en la base de datos.');
        }
      } else {
        errors.push('No se pudo recuperar los datos del usuario.');
      }
    }
  }
  if (errors.length > 0) {
    logger.error(
      ' ::: controller.authresetPassword: Error actualizando la contraseña: \n',
      errors
    );
    res.status(409).json({
      message: 'No se pudo realizar el proceso para restablecer la contraseña',
      errors,
    });
  }
};

export {
  login,
  authenticate,
  token,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
};
