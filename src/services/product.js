import models from '../models';
import {logger} from '../helpers/console';
import errorBuilder from '../helpers/errorBuilder';
import {getJsonQuerys} from '../helpers/validate';

const getList = (query = {}) => new Promise(async (resolve, reject) => {
  logger.info(' ::: services.product.getList');
  let jsonQuery = await getJsonQuerys(query)
    .then(data => data)
    .catch(errors => {
      logger.error(' ::: services.product.getList: Parametros del query mal formados.');
      reject(errorBuilder.simpleErrorWithArray(400,'Parametros del query mal formados.',errors));
    });
  models.Product.findAll(jsonQuery)
    .then(data => {
      resolve({
        success: true,
        message: 'Lista de productos.',
        data: data,
        total: 0,
      });
    })
    .catch(err => {
      logger.error(' ::: services.product.getList: ', err.message || err);
      reject(errorBuilder.simpleError(500,'Error consultando los productos.','server',err));
    })
});

// {
//   logger.info(' ::: service.product.getList');
//   return models.Product.findAll();
// }

export default {
  getList
}
