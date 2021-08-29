import bcrypt from 'bcrypt';
import faker from 'faker';
import db from '../models';
import { logger } from '../helpers/console';
import authController from '../controllers/auth';

const hashPassword = async (password) => {
  logger.info(' ::: controllers.user.hashPassword');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  logger.info(' ::: controllers.user.hashPassword: Contraseña encriptada');
  return hash;
};

// trcuperar una lista de ususarios
const getList = (req, res) => {
  logger.info(' ::: controllers.user.getList');
  const { query } = req;
  const order = query.sort || null;
  const where = query.filter || '{}';
  const attributes = query.attributes || null;
  const range = query.range || null;
  const offset = range ? JSON.parse(range)[0] : 0;
  const limit = range ? JSON.parse(range)[1] : 6;
  let totalRecords = 0;
  db.User.count({
    where: JSON.parse(where),
  })
    .then((amount) => {
      totalRecords = amount;
      return db.User.findAll({
        order: order ? [ JSON.parse(order) ] : null,
        where: JSON.parse(where),
        attributes: attributes ? JSON.parse(attributes) : null,
        offset,
        limit,
      });
    })
    .then((data) => {
      const users = JSON.parse(JSON.stringify(data));
      users.forEach((user) => {
        delete user.password;
        delete user.passwordResetToken;
      });
      res.status(200).json({
        success: true,
        message: 'Lista de usuarios.',
        data: users,
        total: totalRecords,
      });
    })
    .catch((err) => {
      const msg = err.message || 'No se pudo completrar la solicitud.';
      logger.error(` ::: controller.user.getOne: ${msg}`);
      res.status(500).json({
        success: false,
        message: 'No se encontraron usuarios disponibles',
        errors: [
          {
            name: 'server',
            message: msg,
          },
        ],
      });
    });
};

// recuperar un usurio por id
const getOne = (req, res) => {
  logger.info(' ::: controllers.user.getOne');
  db.User.findOne({
    where: { id: req.params.documentNumber },
  })
    .then((user) => {
      if (user) {
        res.status(200).json({
          success: true,
          message: 'Datos del usuario.',
          data: user,
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'El usuario no existe',
        });
      }
    })
    .catch((err) => {
      const msg = err.message || 'No se pudo completrar la solicitud.';
      logger.error(` ::: controller.user.getOne: ${msg}`);
      res.status(500).json({
        success: false,
        message: 'Error recuperando el usuario',
        errors: [
          {
            name: 'server',
            message: msg,
          },
        ],
      });
    });
};

// recupera una listya de usuarios por una lista d eids (en desuso)
const getMany = (req, res) => {
  logger.info(' ::: controllers.user.getMany');
  db.User.findOne({
    where: req.params,
    attributes: { exclude: [ 'password', 'passwordResetToken' ] },
  })
    .then((user) => {
      if (user) {
        res.status(200).json({
          success: true,
          message: 'Datos del usuario.',
          data: user,
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'El usuario no existe',
        });
      }
    })
    .catch((err) => {
      const msg = err.message || 'No se pudo completrar la solicitud.';
      logger.error(` ::: controller.user.getOne: ${msg}`);
      res.status(500).json({
        success: false,
        message: 'Error recuperando el usuario',
        errors: [
          {
            name: 'server',
            message: msg,
          },
        ],
      });
    });
};

const generateUsername = async (firstName, lastName) => {
  logger.info(' ::: controllers.user.generateUsername');
  let count = 1;
  const flag = true;
  while (flag) {
    const username = faker.internet.userName(firstName, lastName);
    logger.info(
      ` ::: controllers.user.generateUsername: Validando username [${username}]`
    );
    const amount = await db.User.count({
      where: { username },
    })
      .then((data) => data)
      .catch((err) => {
        logger.error(
          ' ::: controllers.user.generateUsername: Error generando el username, ',
          err
        );
        return null;
      });
    if (!amount) {
      logger.info(
        ` ::: controllers.user.generateUsername: Username [${username}] generado.`
      );
      return username;
    }
    count += 1;
    if (count > 5) {
      return null;
    }
  }
};

const create = async (req, res) => {
  logger.info(' ::: controllers.user.create');
  const {
    firstName, lastName, email, documentNumber
  } = req.body;
  const username = await generateUsername(firstName, lastName);
  if (username) {
    const password = await hashPassword(faker.internet.password(8));
    const status = 'ACTIVE';
    db.User.create({
      firstName,
      lastName,
      username,
      password,
      email,
      documentNumber,
      status,
    })
      .then((data) => {
        const user = JSON.parse(JSON.stringify(data));
        delete user.password;
        authController.forgotPassword({body: {email: user.email}}, res);
      })
      .catch((err) => {
        logger.error(` ::: controllers.user.create: Eroor: ${err}`);
        res.status(500).json({
          success: false,
          message: 'No se pudo crear el usuario, intente nuevamente',
        });
      });
  } else {
    logger.error('No se pudo crear el username, intente nuevamente');
    res.status(500).json({
      success: false,
      message: 'No se pudo crear el username, intente nuevamente',
    });
  }
};

const update = (req, res) => {
  logger.info(' ::: controllers.user.update');
  const  body = req.body;
  delete body.id;
  delete body.documentNumber;
  delete body.email;
  delete body.password;
  delete body.passwordResetToken;
  delete body.createdAt;
  db.User.update(body, {
    where: {
      documentNumber: req.params.documentNumber,
    },
  }).then(num => {
    if (num === 1) {
      logger.info(' ::: controllers.user.update: Usuario actualizado.');
      res.status(200).json({
        success: true,
        message: 'usuario actualizado.',
        data: {
          documentNumber: req.params.documentNumber,
          ...body,
        },
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: 'Usuario no actualizado.',
        errors: [
          {
            name: 'documentNumber',
            message: 'El documentNumber no existe.'
          }
        ]
      });
    }
  }).catch(err => {
    const msg = err.message || 'No se pudo completrar la solicitud.';
    logger.error(' ::: controllers.user.update: Error actualizando el usuario: .', msg);
    res.status(500).json({ 
      success: false,
      message: 'No se pudo actualizar el usuario',
      errors: [
        {
          name: 'server',
          message: msg
        }
      ]
    });
  });
};

export default {
  getList,
  getOne,
  getMany,
  create,
  update,
  hashPassword,
};
