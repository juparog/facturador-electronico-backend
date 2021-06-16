import configEnv from '../env/config';
import mysql from './mysql';
import postgres from './postgres';

console.log(
  '----------------- Configuracion de base de datos ------------------'
);
console.log(`* Cargando la configuracion: ${configEnv.get('db.dialect')}`);

const grouperConfig = {
  mysql,
  postgres,
};

console.log('* Configuracion cargada correctamente');
console.log(
  '-------------------------------------------------------------------'
);
console.log('');

export default grouperConfig[`${configEnv.get('db.dialect')}`];
