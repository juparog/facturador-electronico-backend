import Validator from 'validatorjs';
import { logger } from './console';
import db from '../models';

Validator.useLang('es');
const passwordRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))/;

// Politica para la contraseña
Validator.register(
  'password_strict',
  (value) => {
    const result = passwordRegex.test(value);
    logger.info(` ::: helpers.register.password_strict: Validacion [${result}]`);
    return result;
  },
  'la contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número'
);

/**
 * Comprueba si el valor entrante ya existe para campos únicos y no únicos en la base de datos
 * por ejemplo, email: required|email|exists:User,email
 */
Validator.registerAsync('exists', async (value, attribute, req, passes) => {
  logger.info(' ::: helpers.registerAsync.exists');
  if (!attribute) {
    logger.error(
      ' ::: helpers.registerAsync.exists: Especifique los requisitos, es decir, fieldName: exist:model,column'
    );
    throw new Error(
      'Especifique los requisitos, es decir, fieldName: exist:model,column'
    );
  }
  // dividir tabla y columna
  const attArr = attribute.split(',');
  if (attArr.length !== 2) {
    logger.error(
      ` ::: helpers.registerAsync.exists: Formato no válido para la regla de validación en ${attribute}`
    );
    throw new Error(
      `Formato no válido para la regla de validación en ${attribute}`
    );
  }

  // asignar el índice de matriz 0 y 1 a la tabla y la columna respectivamente
  const { 0: table, 1: column } = attArr;
  // definir mensaje de error personalizado
  const msg = `El valor de ${column} no existe`;
  // comprobar si el valor entrante ya existe en la base de datos
  const filter = JSON.parse(`{"${column}": "${value}"}`);
  const count = await db[`${table}`].findOne({ where: filter });
  if (count) {
    logger.info(' ::: helpers.registerAsync.exists: Validacion [true]');
    passes();
    return;
  }
  logger.info(` ::: helpers.registerAsync.exists: El valor de ${column} no existe`);
  passes(false, msg); // Devuelve falso si no existe valor
});

const validator = (body, rules, customMessages, callback) => {
  logger.info(' ::: helpers.validator');
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => {
    const errors = validation.errors.all();
    const errorsArray = [];
    Object.keys(errors).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        errors[key].forEach((message) => {
          errorsArray.push({
            name: key,
            message,
          });
        });
      }
    });
    return callback(errorsArray, false);
  });
};

export { validator };
