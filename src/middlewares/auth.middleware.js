import { validator, response400 } from '../helpers/validate';
import { logger } from '../helpers/logger';

const login = (req, res, next) => {
  logger.info(' ::: middleware.validation.auth.login');
  const validationRule = {
    documentNumber: 'required|string|exists:User,documentNumber,0',
    email:
      'required|email|exists:User,email,0|brother-field-value:User,email,status,ACTIVE',
    password: 'required|string|min:8',
  };
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

const token = (req, res, next) => {
  logger.info(' ::: middleware.validation.auth.token');
  const validationRule = {
    refreshToken: 'required|string',
    documentNumber: 'required|string|exists:User,documentNumber,0',
    email: 'required|email|exists:User,email,0',
  };
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

const logout = (req, res, next) => {
  logger.info(' ::: middleware.validation.auth.logout');
  const validationRule = {
    refreshToken: 'required|string',
  };
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

const updatePassword = (req, res, next) => {
  logger.info(' ::: middleware.validation.auth.updatePassword');
  const validationRule = {
    currentPassword: 'required|string',
    newPassword: 'required|string|min:8|password_strict|confirmed',
    passwordConfirm: 'required',
  };
  // ajustar la confirmacion de contraseña al formato que acepta validatosjs
  req.body.newPassword_confirmation = req.body.passwordConfirm;
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

const forgotPassword = (req, res, next) => {
  logger.info(' ::: middleware.validation.auth.forgotPassword');
  const validationRule = {
    email: 'required|email|exists:User,email,0',
  };
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

const resetPassword = (req, res, next) => {
  logger.info(' ::: middleware.validation.auth.resetPassword');
  const validationRule = {
    newPassword: 'required|string|min:8|password_strict|confirmed',
    passwordConfirm: 'required',
    passwordResetToken: 'required|string|exists:User,passwordResetToken,0',
  };
  // ajustar la confirmacion de contraseña al formato que acepta validatosjs
  req.body.newPassword_confirmation = req.body.passwordConfirm;
  validator(req.body, validationRule, {}, (err, status) => response400(res, next, err, status));
};

export default {
  login,
  logout,
  token,
  updatePassword,
  forgotPassword,
  resetPassword,
};
