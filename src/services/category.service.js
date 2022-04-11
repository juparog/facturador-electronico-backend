import models from '../models/index.model';
import { logger } from '../helpers/logger';
import responseBuilder from '../helpers/responseBuilder';
import errorBuilder from '../helpers/errorBuilder';
import { getJsonQuerys } from '../helpers/validate';

const create = (body) => new Promise((resolve, reject) => {
  const {
    name, parent, description
  } = body;

  models.Category.create({ name, parent, description })
    .then((data) => {
      const category = JSON.parse(JSON.stringify(data));
      resolve(responseBuilder.simpleResponse(200, true, 'Categoría creada.', category));
    })
    .catch((err) => {
      logger.error(` ::: controllers.category.create: Error: ${err}`);
      reject(errorBuilder.errorSwitch(err));
    });
});

const getList = (query = {}) => new Promise((resolve, reject) => {
  logger.info(`services.category.getList`);
  getJsonQuerys(query)
    .then((jsonQuery) => models.Category.findAll(jsonQuery))
    .then((data) => resolve(responseBuilder.simpleResponse(200, true, 'Lista de categorías.', data)))
    .catch((err) => reject(errorBuilder.errorSwitch(err)));
});

export default {
  create,
  getList
};
