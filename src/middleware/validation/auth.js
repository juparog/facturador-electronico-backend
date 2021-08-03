import { validator } from '../../helpers/validate';

export const login = (req, res, next) => {
  const validationRule = {
    documentNumber: 'required|string|exists:Users,documentNumber',
    email: 'required|email|exists:Users,email',
    password: 'required|string|min:8',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).json({
        success: false,
        message: 'Validacion fallida',
        errors: err,
      });
    } else {
      next();
    }
  });
};
