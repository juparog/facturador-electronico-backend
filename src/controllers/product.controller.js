import productService from '../services/product.service';
import { logger } from '../helpers/logger';

// rescuperar una lista de productos
const getList = (req, res) => {
  logger.info(' ::: controllers.product.getList');
  productService
    .getList(req.query)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.error(` ::: controllers.product.getList: ${err.detail.message}`);
      res.status(err.code).json(err.detail);
    });
};

export default {
  getList,
};
