import bcrypt from 'bcrypt';
import models from '../models/index.model';
import errorBuilder from '../helpers/errorBuilder';
import { getJsonQuerys } from '../helpers/validate';
import { parentLogger, getCallerFile } from '../helpers/logger';

const log = parentLogger.child({location: `src/services/${getCallerFile()}`});

const hashPassword = async (password) => {
  log.debug('funcion hashPassword');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  log.debug('Contraseña encriptada');
  return hash;
};

const getList = (query = {}) => new Promise((resolve, reject) => {
  log.debug('funcion getList');
  getJsonQuerys(query)
    .then((jsonQuery) => models.User.findAll(jsonQuery))
    .then((data) => resolve({
      success: true,
      message: 'Lista de usuarios.',
      data,
      total: 0,
    }))
    .catch((err) => reject(errorBuilder.errorSwitch(err)));
});

export default {
  getList,
  hashPassword
};
