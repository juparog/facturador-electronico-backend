import models from '../models/index.model';
import { logger } from '../helpers/logger-old';
import errorBuilder from '../helpers/errorBuilder';
import { getJsonQuerys } from '../helpers/validate';

const getList = (query = {}) => new Promise((resolve, reject) => {
  logger.info(' ::: services.product.getList');
  getJsonQuerys(query)
    .then((jsonQuery) => models.Product.findAll(jsonQuery))
    .then((data) => resolve({
      success: true,
      message: 'Lista de productos.',
      data,
      total: 0,
    }))
    .catch((err) => reject(errorBuilder.errorSwitch(err)));
});

export default {
  getList,
};
