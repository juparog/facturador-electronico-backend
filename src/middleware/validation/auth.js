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

export const login = (req, res, next) => {
  const validationRule = {
    documentNumber: 'required|string|exists:Users,documentNumber',
    email: 'required|email|exists:Users,email',
    password: 'required|string|min:8',
  };
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

export const token = (req, res, next) => {
  const validationRule = {
    refreshToken: 'required|string',
    documentNumber: 'required|string|exists:Users,documentNumber',
    email: 'required|email|exists:Users,email',
  };
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

export const logout = (req, res, next) => {
  const validationRule = {
    refreshToken: 'required|string',
  };
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

export const updatePassword = (req, res, next) => {
  const validationRule = {
    currentPassword: 'required|string',
    newPassword: 'required|string|min:8|password_strict|confirmed',
    passwordConfirm: 'required',
  };
  // ajustar la confirmacion de contraseña al formato que acepta validatosjs
  req.body.newPassword_confirmation = req.body.passwordConfirm;
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

export const forgotPassword = (req, res, next) => {
  const validationRule = {
    email: 'required|email|exists:Users,email',
  };
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

export const resetPassword = (req, res, next) => {
  const validationRule = {
    newPassword: 'required|string|min:8|password_strict|confirmed',
    passwordConfirm: 'required',
    passwordResetToken: 'required|string|exists:Users,passwordResetToken',
  };
  // ajustar la confirmacion de contraseña al formato que acepta validatosjs
  req.body.newPassword_confirmation = req.body.passwordConfirm;
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};
