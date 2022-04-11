import categoryService from '../services/category.service';
import { logger } from '../helpers/logger';

const getList = (req, res) => {
  logger.info(' ::: controllers.category.getList');
  categoryService
    .getList(req.query)
    .then((data) => {
      res.status(data.code).json(data.detail);
    })
    .catch((err) => {
      logger.error(` ::: controllers.category.getList: ${err.detail.message}`);
      res.status(err.code).json(err.detail);
    });
};

const create = (req, res) => {
  logger.info(' ::: controllers.category.create');
  categoryService
    .create(req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      logger.error(` ::: controllers.category.create: ${err.detail.message}`);
      res.status(err.code).json(err.detail);
    });
};

export default {
  getList,
  create
};
