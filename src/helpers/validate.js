import Validator from 'validatorjs';
import { QueryTypes } from 'sequelize';
import db from '../models';

Validator.useLang('es');
const passwordRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))/;

// Politica para la contraseña
Validator.register(
  'password_strict',
  (value) => passwordRegex.test(value),
  'la contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número'
);

/**
 * Comprueba si el valor entrante ya existe para campos únicos y no únicos en la base de datos
 * por ejemplo, email: required|email|exists:User,email
 */
Validator.registerAsync('exists', async (value, attribute, req, passes) => {
  if (!attribute) {
    throw new Error(
      'Especifique los requisitos, es decir, fieldName: exist:table,column'
    );
  }
  // dividir tabla y columna
  const attArr = attribute.split(',');
  if (attArr.length !== 2) {
    throw new Error(
      `Formato no válido para la regla de validación en ${attribute}`
    );
  }

  // asignar el índice de matriz 0 y 1 a la tabla y la columna respectivamente
  const { 0: table, 1: column } = attArr;
  // definir mensaje de error personalizado
  const msg = `El valor de ${column} no existe`;
  // comprobar si el valor entrante ya existe en la base de datos
  // console.log(`{${column}: '${value}'}`);
  // console.log(JSON.parse(`{${column}: '${value}'}`));
  // console.log({email:'shsghdgdf'});
  // const count = await db.User.findOne({ where: { email } });
  // // const count = await db.sequelize.query(
  // //   `SELECT count(1) as count FROM ${table} where ${column}='${value}'`,
  // //   { type: QueryTypes.SELECT }
  // // );

  // console.log("XXXXXXXXXXXXXXXXXXx");

  // if (count[0].count > 0) {
  //   passes();
  //   return;
  // }
  // passes(false, msg); // Devuelve falso si no existe valor
  passes();
});

const validator = (body, rules, customMessages, callback) => {
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
