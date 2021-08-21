import bcrypt from 'bcrypt';
import { ValidationError } from 'sequelize';
import db from '../models';
import { logger } from '../helpers/console';
import faker from 'faker';

const hashPassword = async (password) => {
  logger.info(' ::: controllers.user.hashPassword');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  logger.info(' ::: controllers.user.hashPassword: Contraseña encriptada');
  return hash;
};

const getList = async (req, res) => {
  logger.info(' ::: controllers.user.getList');
  const { query } = req;
  console.log(query);
  const order = query.sort || null;
  const where = query.filter || '{}';
  let attributes = query.attributes || null;
  const range = query.range || null;
  const offset = range ? JSON.parse(range)[0] : 0;
  const limit = range ? JSON.parse(range)[1] : 6;
  const amount = await db.User.count({
    where: JSON.parse(where)
  });
  const data = await db.User.findAll({
    order: order ? [ JSON.parse(order) ] : null,
    where: JSON.parse(where),
    attributes: attributes ? JSON.parse(attributes) : null,
    /* attributes: {
      include: attributes ? JSON.parse(attributes) : null,
      exclude: ['password']
    }, */
    offset,
    limit,
  });
  if (data) {
    res.status(200).json({ 
      success: true,
      message: "Lista de usuarios.",
      data,
      total: amount
    });
  } else {
    res.status(409).json({ message: 'No se pudo listar los usuarios' });
  }
};

const getOneUser = async (req, res) => {
  logger.info(' ::: controllers.user.getOneUser');
  const data = await db.User.findOne({
    where: req.params,
  });
  res.status(200).json({ data });
};

const generateUsername = async (firstName,lastName) => {
  logger.info(' ::: controllers.user.generateUsername');
  let count = 1;
  while(true){
    const username = faker.internet.userName(firstName,lastName);
    logger.info(` ::: controllers.user.generateUsername: Validando username [${username}]`);
    const amount = await db.User.count({
      where: {username}
    }).then(data => {
      return data;
    }).catch(err => {
      logger.error(' ::: controllers.user.generateUsername: Error generando el username, ', err);
      return null;
    });
    if(!amount){
      logger.info(` ::: controllers.user.generateUsername: Username [${username}] generado.`);
      return username;
    }
    count++;
    if(count>5){
      return null;
    }
  }
};

const create = async (req, res) => {
  logger.info(' ::: controllers.user.create');
  const {firstName,lastName,email,documentNumber} = req.body;
  const username = await generateUsername(firstName,lastName);
  if(username){
    const password = await hashPassword(faker.internet.password(8));
    const status = 'ACTIVE';
    db.User.create({firstName,lastName, username, password ,email,documentNumber, status})
    .then(data => {
      const user = JSON.parse(JSON.stringify(data));
      delete user['password'];
      res.status(200).json({ 
        success: true,
        message: 'Usuario creado.',
        data: user
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({ 
        success: false,
        message: 'No se pudo crear el usuario, intente nuevamente'
      });
    });
  } else {
    res.status(500).json({ 
      success: false,
      message: 'No se pudo crear el username, intente nuevamente'
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
  create,
  updateUser,
  getOneUser,
  hashPassword,
};
