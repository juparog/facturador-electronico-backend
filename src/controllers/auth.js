import jwt from 'jsonwebtoken';
import { db } from '../models';
import { logger } from '../helpers/console';
import config from '../config/env/config';
import randtoken from 'rand-token';

const refreshTokens = [];

const getToken = (user) => jwt.sign(
  { user: { id: user.id, username: user.username } },
  config.get('app.secretKey'),
  { expiresIn: '1h' }
);

const login = async (req, res) => {
  logger.info(' ::: auth.controller.login');
  const { nit, email, password } = req.body;

  const user = await db.User.findOne({
    where: { nit, email },
  });

  if (user) {
    logger.info(' ::: auth.controller.login: Usuario valido');

    if (user.password === password) {
      logger.info(' ::: auth.controller.login: Usuario logeado!');

      const accessToken = getToken(user);
      const refreshToken  = randtoken.uid(256);

      refreshTokens.push(refreshToken)

      res.status(200).json({
        accessToken,
        refreshToken
      });
    } else {
      logger.error(' ::: auth.controller.login: Contraseña incorrecta: ');
      res.status(401).json({ message: 'Contraseña incorrecta' });
    }
  } else {
    logger.error(' ::: auth.controller.login: Usuario ó email incorrecto');
    res.status(401).json({ message: 'Nit ó email incorrecto' });
  }
};

const authenticate = (req, res, next) => {
  logger.info(' ::: auth.controller.authenticate');
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.get('app.secretKey'), (err, decode) => {
      if (err) {
        logger.info(
          ' ::: auth.controller.authenticate: El token de autenticacion no es valido'
        );
        res
          .status(403)
          .json({ message: 'El token de autenticacion no es valido, por favor inicie sesión' });
      } else {
        logger.info(' ::: auth.controller.authenticate: Autenticacion exitosa!');
        next();
      }
    });
  } else {
    logger.error(
      ' ::: auth.controller.authenticate: No se encontro el encabezado "authorization"'
    );
    res
      .status(401)
      .json({ message: 'No se encontro el encabezado "authorization"' });
  }
};

const token =  (req, res) => {
  const { refreshToken, nit, email } = req.body;
  if (!token) {
    logger.error(' ::: auth.controller.token: Falta el "refreshToken" en la petición');
    return res.status(401).json({message: 'Falta el "refreshToken" en la petición'});
  }

  if (!refreshTokens.includes(refreshToken)) {
    logger.error(' ::: auth.controller.token: El "refreshToken" no es valido, por favor inicie sesión');
    return res.status(403).json('El "refreshToken" no es valido, por favor inicie sesión');
  }

  const accessToken = getToken({nit, email});
  logger.info(' ::: auth.controller.token: Nuevo token generado correctamente');
  res.json({
    accessToken
  });
};

const logout =  (req, res) => {
  const { refreshToken } = req.body;

  if (!token) {
    logger.error(' ::: auth.controller.token: Falta el "refreshToken" en la petición');
    return res.status(401).json({message: 'Falta el "refreshToken" en la petición'});
  }

  refreshTokens = refreshTokens.filter(token => t !== refreshToken);
  logger.info(' ::: auth.controller.token: Session finalizada!');
  res.status(200).json({message:'Session finalizada!'});
};

export { login, authenticate, token, logout };
