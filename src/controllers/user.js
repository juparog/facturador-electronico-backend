import bcrypt from 'bcrypt';
import faker from 'faker';
import db from '../models';
import { logger } from '../helpers/console';

const hashPassword = async (password) => {
  logger.info(' ::: controllers.user.hashPassword');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  logger.info(' ::: controllers.user.hashPassword: Contraseña encriptada');
  return hash;
};

const getList = (req, res) => {
  logger.info(' ::: controllers.user.getList');
  const { query } = req;
  const order = query.sort || null;
  const where = query.filter || '{}';
  const attributes = query.attributes || null;
  const range = query.range || null;
  const offset = range ? JSON.parse(range)[0] : 0;
  const limit = range ? JSON.parse(range)[1] : 6;
  let numberRecords = 0;
  db.User.count({
    where: JSON.parse(where),
  })
    .then((amount) => {
      numberRecords = amount;
      return db.User.findAll({
        order: order ? [ JSON.parse(order) ] : null,
        where: JSON.parse(where),
        attributes: attributes ? JSON.parse(attributes) : null,
        offset,
        limit,
      });
    })
    .then((users) => {
      res.status(200).json({
        success: true,
        message: 'Lista de usuarios.',
        data: users,
        total: numberRecords,
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

const getOne = async (req, res) => {
  logger.info(' ::: controllers.user.getOne');
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
  while (true) {
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
    count++;
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
        res.status(200).json({
          success: true,
          message: 'Usuario creado.',
          data: user,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: 'No se pudo crear el usuario, intente nuevamente',
        });
      });
  } else {
    res.status(500).json({
      success: false,
      message: 'No se pudo crear el username, intente nuevamente',
    });
  }
};

const updateUser = async (req, res) => {
  const num = await db.User.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  if (num[0] === 1) {
    res.status(200).json({
      data: {
        id: req.params.id,
        ...req.body,
      },
    });
  } else {
    res.status(409).json({ message: 'No se pudo actualizar el usuario' });
  }
};

export default {
  getList,
  getOne,
  create,
  updateUser,
  hashPassword,
};
