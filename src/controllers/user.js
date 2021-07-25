import bcrypt from 'bcrypt';
import { ValidationError } from 'sequelize';
import { db } from '../models';
import { logger } from '../helpers/console';

const hashPassword = async (password) => {
  logger.info(' ::: auth.controller.hashPassword');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  logger.info(' ::: auth.controller.hashPassword: Contraseña encriptada');
  return hash;
};

const getListUser = async (req, res) => {
  logger.info(' ::: auth.controller.getListUser');
  const data = await db.User.findAll({});
  if (data) {
    res.status(200).json({ data });
  } else {
    res.status(409).json({ message: 'No se pudo listar los usuarios' });
  }
};

const getOneUser = async (req, res) => {
  logger.info(' ::: auth.controller.getOneUser');
  const data = await db.User.findOne({
    where: req.params,
  });
  res.status(200).json({ data });
};

const createUser = async (req, res) => {
  logger.info(' ::: auth.controller.createUser');
  req.body.password = await hashPassword(req.body.password);
  if (req.body.password) {
    try {
      const data = await db.User.create(req.body);
      if (data) {
        res.status(200).json({ data });
      } else {
        res.status(409).json({ message: 'No se pudo crear el usuario' });
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors = [];
        error.errors.forEach((err) => {
          errors.push(err.message);
        });
        res.status(400).json({
          message: 'No se pudo crear el usuario',
          errors,
        });
      }
    }
  } else {
    res.status(500).json({ message: 'No se pudo encriptar la contraseña' });
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

export {
  getListUser, createUser, updateUser, getOneUser, hashPassword
};
