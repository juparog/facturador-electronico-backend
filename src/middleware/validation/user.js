import { validator } from '../../helpers/validate';

const response400 = (res, next, err, status) => {
  if (!status) {
    res.status(400).json({
      success: false,
      message: 'Validacion fallida',
      errors: err,
    });
  } else {
    next();
  }
};

const create = (req, res, next) => {
  const validationRule = {
    firstName: 'required|string',
    lastName: 'required|string',
    email: 'required|email|exists:User,email,1',
    documentNumber: 'required|string|exists:User,documentNumber,1'
  };
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

export default {create}
