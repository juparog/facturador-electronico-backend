import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import bcrypt from 'bcrypt';
import { db } from '../models';
import { logger } from '../helpers/console';
import { configEnv } from '../config/env/config';
import { sendEmailForgotPassword } from '../helpers/mail';

let refreshTokens = [];

const comparePassword = async (password, password2) => {
  logger.info(' ::: auth.controller.comparePassword');
  const isSame = await bcrypt.compare(password2, password);
  logger.info(
    ` ::: auth.controller.comparePassword: Contraseña comparada [${isSame}]`
  );
  return isSame;
};

const hashPassword = async (password) => {
  logger.info(' ::: auth.controller.hashPassword');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  logger.info(' ::: auth.controller.hashPassword: Contraseña encriptada');
  return hash;
};

const getToken = (payload, expiresIn = '1d') => jwt.sign(payload, configEnv.get('app.secretKey'), { expiresIn });

const verifiToken = (token) => {
  logger.info(' ::: auth.controller.verifiToken');
  let decoded = null;
  try {
    decoded = jwt.verify(token, configEnv.get('app.secretKey'));
  } catch (err) {
    logger.error(' ::: auth.controller.verifiToken: token no valido');
  }
  return decoded;
};

const login = async (req, res) => {
  logger.info(' ::: auth.controller.login');
  const { documentNumber, email, password } = req.body;

  const user = await db.User.findOne({
    where: { documentNumber, email },
  });

  if (user) {
    logger.info(' ::: auth.controller.login: Usuario valido');
    const isSame = await comparePassword(user.password, password);
    if (isSame) {
      logger.info(' ::: auth.controller.login: Usuario logeado!');

      const accessToken = getToken(
        user,
        configEnv.get('app.accessTokenExpirationTime')
      );
      const refreshToken = randtoken.uid(256);

      refreshTokens.push(refreshToken);

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } else {
      logger.error(' ::: auth.controller.login: Contraseña incorrecta: ');
      res.status(401).json({ message: 'Contraseña incorrecta' });
    }
  } else {
    logger.error(' ::: auth.controller.login: Usuario ó email incorrecto');
    res.status(401).json({ message: 'documentNumber ó email incorrecto' });
  }
};

const authenticate = (req, res, next) => {
  logger.info(' ::: auth.controller.authenticate');
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const accessToken = authHeader.split(' ')[1];
    const validAccessToken = verifiToken(accessToken);
    if (validAccessToken) {
      logger.info(' ::: auth.controller.authenticate: Autenticacion exitosa!');

      req.user = validAccessToken.user;
      next();
    } else {
      logger.info(
        ' ::: auth.controller.authenticate: El token de autenticacion no es valido'
      );
      res.status(403).json({
        message:
          'El token de autenticacion no es valido, por favor inicie sesión',
      });
    }
  } else {
    logger.error(
      ' ::: auth.controller.authenticate: No se encontro el encabezado "authorization"'
    );
    res
      .status(401)
      .json({ message: 'No se encontro el encabezado "authorization"' });
  }
};

const token = (req, res) => {
  const { refreshToken, documentNumber, email } = req.body;
  if (!token) {
    logger.error(
      ' ::: auth.controller.token: Falta el "refreshToken" en la petición'
    );
    res.status(401).json({ message: 'Falta el "refreshToken" en la petición' });
  }

  if (!refreshTokens.includes(refreshToken)) {
    logger.error(
      ' ::: auth.controller.token: El "refreshToken" no es valido, por favor inicie sesión'
    );
    res
      .status(403)
      .json('El "refreshToken" no es valido, por favor inicie sesión');
  }

  const accessToken = getToken({ documentNumber, email });
  logger.info(' ::: auth.controller.token: Nuevo token generado correctamente');
  res.json({
    accessToken,
  });
};

const logout = (req, res) => {
  const { refreshToken } = req.body;

  if (!token) {
    logger.error(
      ' ::: auth.controller.token: Falta el "refreshToken" en la petición'
    );
    res.status(401).json({ message: 'Falta el "refreshToken" en la petición' });
  }

  refreshTokens = refreshTokens.filter((t) => t !== refreshToken);
  logger.info(' ::: auth.controller.token: Session finalizada!');
  res.status(200).json({ message: 'Session finalizada!' });
};

const updatePassword = async (req, res) => {
  logger.info(' ::: auth.controller.updatePassword');
  const errors = [];
  if (req.body.newPassword !== req.body.passwordconfirmation) {
    errors.push('La nueva contraseña y la de confirmación no coinciden.');
  } else {
    logger.info(
      ' ::: auth.controller.updatePassword: validando la contraseña...'
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
            ' ::: auth.controller.updatePassword: Contraseña actualizada'
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
      ' ::: auth.controller.updatePassword: Error actualizando la contraseña: \n',
      errors
    );
    res.status(409).json({
      message: 'No se pudo actualizar la contraseña del usuario',
      errors,
    });
  }
};

const forgotPassword = async (req, res) => {
  logger.info(' ::: auth.controller.forgotPassword');
  const errors = [];
  let user = await db.User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    logger.info(' ::: auth.controller.forgotPassword: generando el token...');
    user = JSON.parse(JSON.stringify(user));
    const payloadToken = {
      user: {
        id: user.id,
        username: user.username,
      },
    };
    const passwordResetToken = getToken(payloadToken);
    logger.info(
      ' ::: auth.controller.forgotPassword: token generado, guardando el token...'
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
      logger.info(' ::: auth.controller.forgotPassword: token guardado.');
      sendEmailForgotPassword(req.body.email);
      logger.info(' ::: auth.controller.forgotPassword: correo enviado.');
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
      ' ::: auth.controller.forgotPassword: Error actualizando la contraseña: \n',
      errors
    );
    res.status(409).json({
      message: 'No se pudo realizar el proceso de recuperacion de contraseña',
      errors,
    });
  }
};

const resetPassword = async (req, res) => {
  logger.info(' ::: auth.controller.resetPassword');
  const errors = [];
  if (req.body.newPassword !== req.body.passwordconfirmation) {
    errors.push('La nueva contraseña y la de confirmación no coinciden.');
  } else {
    logger.info(
      ' ::: auth.controller.resetPassword: validando el token de acceso...'
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
            ' ::: auth.controller.resetPassword: Contraseña actualizada'
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
      ' ::: auth.controller.resetPassword: Error actualizando la contraseña: \n',
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
