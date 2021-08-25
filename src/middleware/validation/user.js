import { validator, response400 } from '../../helpers/validate';
import { logger } from '../../helpers/console';

const create = (req, res, next) => {
  logger.info(' ::: middleware.validation.user.create');
  const validationRule = {
    firstName: 'required|string',
    lastName: 'required|string',
    email: 'required|email|exists:User,email,1',
    documentNumber: 'required|string|exists:User,documentNumber,1',
  };
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

const getOne = (req, res, next) => {
  logger.info(' ::: middleware.validation.user.getOne');
  const validationRule = {
    id: 'required|numeric',
  };
  validator(req.params, validationRule, {}, (err, status) => response400(res, next, err, status));
};

export default { create, getOne };
