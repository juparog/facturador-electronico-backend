import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import bcrypt from 'bcrypt';
import db from '../models';
import { logger } from '../helpers/console';
import { configEnv } from '../config/env/config';
import { sendEmailForgotPassword } from '../helpers/mail';

let refreshTokens = [];

const comparePassword = async (password, password2) => {
  logger.info(' ::: controller.auth.comparePassword');
  const isSame = await bcrypt.compare(password2, password);
  logger.info(
    ` ::: controller.auth.comparePassword: Contraseña comparada [${isSame}]`
  );
  return isSame;
};

const hashPassword = async (password) => {
  logger.info(' ::: controller.auth.hashPassword');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  logger.info(' ::: controller.auth.hashPassword: Contraseña encriptada');
  return hash;
};

const getToken = (payload, expiresIn = '1d') => jwt.sign(payload, configEnv.get('app.secretKey'), { expiresIn });

const verifiToken = (token) => {
  logger.info(' ::: controller.auth.verifiToken');
  let decoded = null;
  try {
    decoded = jwt.verify(token, configEnv.get('app.secretKey'));
  } catch (err) {
    logger.error(' ::: controller.auth.verifiToken: token no valido');
  }
  return decoded;
};

const updateUser = (body, query, res, passwordResetToken) => {
  logger.info(' ::: controller.auth.updateUser');
  db.User.update(body, {
    where: query,
  })
    .then((num) => {
      logger.info(
        ` ::: controller.auth.updateUser: Actualización ${
          num < 1 ? 'fallida' : 'exitosa'
        }.`
      );
      // // enviar correo
      // sendEmailForgotPassword(user, passwordResetToken);
      // logger.info(' ::: controller.auth.updateUser: correo enviado.');
      let data;
      if (passwordResetToken) {
        data = { passwordResetToken };
      }
      res.status(200).json({
        success: true,
        message: `Solicitud${num < 1 ? ' NO' : ''} completada.`,
        data,
      });
    })
    .catch((err) => {
      logger.error(
        ' ::: controller.auth.updateUser: Fallo la actualizacion. ',
        err
      );
      throw new Error(
        'Error intentando actualizar el usuario en la base de datos.'
      );
    });
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
            success: true,
            message: 'Login exitoso.',
            data: {
              accessToken,
              refreshToken,
            },
          });
        } else {
          logger.error(' ::: controller.auth.login: Contraseña incorrecta. ');
          res.status(400).json({
            success: false,
            message: 'Fallo el login.',
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
        res.status(400).json({
          success: false,
          message: 'Fallo el login.',
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
        message: 'Fallo el login.',
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
  logger.info(' ::: controller.auth.authenticate');
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const accessToken = authHeader.split(' ')[1];
    const validAccessToken = verifiToken(accessToken);
    if (validAccessToken) {
      logger.info(' ::: controller.auth.authenticate: Autenticacion exitosa.');
      db.User.findOne({
        where: {
          documentNumber: validAccessToken.user.documentNumber,
          email: validAccessToken.user.email,
          status: 'ACTIVE',
        },
      })
        .then((user) => {
          if (user) {
            req.user = validAccessToken.user;
            next();
          } else {
            res.status(401).json({
              success: false,
              message: 'Error de autenticación.',
              errors: [
                {
                  name: 'user',
                  message: 'El usuario no se encuentra activo.',
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
            message: 'Fallo la actualizacion de contraseña.',
            errors: [
              {
                name: 'server',
                message: msg,
              },
            ],
          });
        });
    } else {
      logger.info(
        ' ::: controller.auth.authenticate: El token de autenticacion no es valido, por favor inicie sesión.'
      );
      res.status(401).json({
        success: false,
        message: 'Error de autenticación.',
        errors: [
          {
            name: 'token',
            message:
              'El token de autenticacion no es valido, por favor inicie sesión.',
          },
        ],
      });
    }
  } else {
    logger.error(
      ' ::: controller.auth.authenticate: No se encontro el encabezado "authorization".'
    );
    res.status(400).json({
      success: false,
      message: 'Error de autenticación.',
      errors: [
        {
          name: 'header',
          message: 'No se encontro el encabezado <Authorization>.',
        },
      ],
    });
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
          message: 'El refreshToken no es valido.',
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
  logger.info(' ::: controller.auth.updatePassword');
  db.User.findOne({
    where: req.user,
  })
    .then(async (userDb) => {
      if (userDb) {
        const user = JSON.parse(JSON.stringify(userDb));
        const isSame = await comparePassword(
          user.password,
          req.body.currentPassword
        );
        if (isSame) {
          req.body.newPassword = await hashPassword(req.body.newPassword);
          updateUser({ password: req.body.newPassword }, req.user, res);
        } else {
          logger.error(
            ' ::: controller.auth.updatePassword: La contraseña actual del usuario no coincide.'
          );
          res.status(400).json({
            success: false,
            message: 'Fallo la actualizacion de contraseña.',
            errors: [
              {
                name: 'user',
                message: 'La contraseña actual del usuario no coincide.',
              },
            ],
          });
        }
      } else {
        logger.error(
          ' ::: controller.auth.updatePassword: No se pudo recuperar el usuario en la base de datos.'
        );
        res.status(400).json({
          success: false,
          message: 'Fallo la actualizacion de contraseña.',
          errors: [
            {
              name: 'user',
              message: 'No se pudo completar la solicitud.',
            },
          ],
        });
      }
    })
    .catch((err) => {
      logger.error(
        ' ::: controller.auth.updatePassword: Fallo la actualizacion de contraseña. ',
        err
      );
      res.status(500).json({
        success: false,
        message: 'Fallo la actualizacion de contraseña.',
        errors: [
          {
            name: 'server',
            message: 'No se pudo completar la solicitud.',
          },
        ],
      });
    });
};

const forgotPassword = async (req, res) => {
  logger.info(' ::: controller.auth.forgotPassword');
  db.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user) {
        const userJson = JSON.parse(JSON.stringify(user));
        logger.info(' ::: controller.auth.forgotPassword: Generando el token.');
        const payloadToken = {
          user: {
            id: userJson.id,
            username: userJson.username,
          },
        };
        const passwordResetToken = getToken(payloadToken);
        logger.info(
          ' ::: controller.auth.forgotPassword: token generado, guardando el token..'
        );
        updateUser(
          { passwordResetToken },
          { email: req.body.email },
          res,
          passwordResetToken
        );
        // enviar correo
        sendEmailForgotPassword(user, passwordResetToken);
        logger.info(' ::: controller.auth.forgotPassword: correo enviado.');
      } else {
        logger.error(
          ' ::: controller.auth.forgotPassword: No se pudo recuperar el usuario en la base de datos.'
        );
        res.status(400).json({
          success: false,
          message: 'Fallo la recuperacion de contraseña.',
          errors: [
            {
              name: 'user',
              message: 'No se pudo completar la solicitud.',
            },
          ],
        });
      }
    })
    .catch((err) => {
      logger.error(
        ' ::: controller.auth.forgotPassword: Fallo la recuperacion de contraseña. ',
        err
      );
      res.status(500).json({
        success: false,
        message: 'Fallo la recuperacion de contraseña.',
        errors: [
          {
            name: 'server',
            message: 'No se pudo completar la solicitud.',
          },
        ],
      });
    });
};

const resetPassword = async (req, res) => {
  logger.info(' ::: controller.auth.resetPassword');
  const validAccessToken = verifiToken(req.body.passwordResetToken);
  if (!validAccessToken) {
    logger.error(
      ' ::: controller.auth.resetPassword: el passwordResetToken no es valido.'
    );
    res.status(400).json({
      success: false,
      message: 'Fallo el restablecimiento de contraseña.',
      errors: [
        {
          name: 'passwordResetToken',
          message: 'El passwordResetToken no es valido.',
        },
      ],
    });
  } else {
    db.User.findOne({
      where: {
        passwordResetToken: req.body.passwordResetToken,
      },
    })
      .then(async (user) => {
        if (user) {
          const userJson = JSON.parse(JSON.stringify(user));
          req.body.newPassword = await hashPassword(req.body.newPassword);
          updateUser(
            {
              password: req.body.newPassword,
              passwordResetToken: null,
            },
            { id: userJson.id },
            res
          );
        } else {
          logger.error(
            ' ::: controller.auth.resetPassword: No se pudo recuperar el usuario en la base de datos.'
          );
          res.status(400).json({
            success: false,
            message: 'Fallo el restablecimiento de contraseña.',
            errors: [
              {
                name: 'user',
                message: 'No se pudo completar la solicitud.',
              },
            ],
          });
        }
      })
      .catch((err) => {
        logger.error(
          ' ::: controller.auth.resetPassword: Fallo la recuperacion de contraseña. ',
          err
        );
        res.status(500).json({
          success: false,
          message: 'Fallo el restablecimiento de contraseña.',
          errors: [
            {
              name: 'server',
              message: 'No se pudo completar la solicitud.',
            },
          ],
        });
      });
  }
};

export default {
  login,
  authenticate,
  token,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
};
