import { logger } from './logger-old';

const simpleError = (code, message, name, err) => {
  logger.error(' ::: helpers.errorBuilder.simpleError.');
  const msg = err.message || `${err}`;
  return {
    code,
    detail: {
      success: false,
      message,
      errors: [
        {
          name,
          message: msg,
        },
      ],
    },
  };
};

const errorWithArray = (code, message, errors) => {
  logger.error(' ::: helpers.errorBuilder.errorWithArray.');
  return {
    code,
    detail: {
      success: false,
      message,
      errors,
    },
  };
};

const errorSwitch = (err) => {
  logger.error(' ::: helpers.errorBuilder.errorSwitch.');
  let msg = 'Error realizando la operacion.';
  switch (err.name) {
  case 'SequelizeUniqueConstraintError':
    msg = 'Error por regla de campos únicos.';
    logger.error(` ::: helpers.errorBuilder.errorSwitch: ${msg}: `);
    return errorWithArray(
      400,
      msg,
      err.errors
    );
  case 'GetJsonQueryError':
    msg = 'Parametros del query mal formados.';
    logger.error(` ::: helpers.errorBuilder.errorSwitch: ${msg}: `);
    return errorWithArray(
      400,
      msg,
      err.errors
    );
  case 'SequelizeDatabaseError':
    msg = 'Error ejecutando la consulta sql.'
    logger.error(` ::: helpers.errorBuilder.errorSwitch: ${msg}: `);
    return simpleError(
      500,
      msg,
      'database',
      err
    );
  default:
    logger.error(' ::: helpers.errorBuilder.errorSwitch: ', err.message || err);
    return simpleError(500, msg, 'server', err);
  }
};

export default {
  simpleError,
  errorWithArray,
  errorSwitch,
};
