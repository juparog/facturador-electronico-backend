import models from '../models';
import {logger} from '../helpers/console';
import errorBuilder from '../helpers/errorBuilder';
import {getJsonQuerys} from '../helpers/validate';

const getList = (query = {}) => new Promise((resolve, reject) => {
  logger.info(' ::: services.product.getList');
  getJsonQuerys(query)
    .then(jsonQuery => models.Product.findAll(jsonQuery))
    .then(data => {
      return resolve({
        success: true,
        message: 'Lista de productos.',
        data: data,
        total: 0,
      });
    })
    .catch(err => {
      switch (err.message) {
        case 'helpers.validator.getJsonQuerys':
          logger.error(' ::: services.product.getList: No se pudieron transformar los parametros del query.');
          reject(errorBuilder.simpleErrorWithArray(400,'Parametros del query mal formados.',err.errors));
          break;
        default:
          logger.error(' ::: services.product.getList: ', err.message || err);
          reject(errorBuilder.simpleError(500,'Error consultando los productos.','server',err));
          break;
      }
    });
});

export default {
  getList
}
