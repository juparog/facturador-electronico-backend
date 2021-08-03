import { validator } from '../../helpers/validate';

const reponse412 = (res, next, err, status) => {
  if (!status) {
    res.status(412).json({
      success: false,
      message: 'Validacion fallida',
      errors: err,
    });
  } else {
    next();
  }
};

export const login = (req, res, next) => {
  const validationRule = {
    documentNumber: 'required|string|exists:Users,documentNumber',
    email: 'required|email|exists:Users,email',
    password: 'required|string|min:8',
  };
  validator(req.body, validationRule, {}, (err, status) => reponse412(res, next, err, status));
};

export const token = (req, res, next) => {
  const validationRule = {
    refreshToken: 'required|string',
    documentNumber: 'required|string|exists:Users,documentNumber',
    email: 'required|email|exists:Users,email',
  };
  validator(req.body, validationRule, {}, (err, status) => reponse412(res, next, err, status));
};
