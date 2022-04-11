import db from '../../models/index.model';
import syncDefaults from './syncDefaults';
import { parentLogger, getCallerFile } from '../logger';

const log = parentLogger.child({location: `src/helpers/db/${getCallerFile()}`});

const dbSync = async (mode) => {
  log.debug('funcion dbSync');
  log.info('Sincronizando la base de datos...');

  const options = mode !== '' ? JSON.parse(`{"${mode}":true}`) : {};
  log.debug('Opciones de sincronizacion: ', options);

  return db.sequelize
    .sync(options)
    .then(() => true)
    .then(() => syncDefaults.categories())
    .then(() => syncDefaults.users())
    .then(() => {
      log.info('Sincronizacion de la DB completa!');
    })
    .catch((err) => log.error(err));
};

const tablesTruncate = async () => {
  log.debug('funcion tablesTruncate');
  log.info('Truncando las tablas de la DB...');
  Object.values(db).map(async (model) => {
    await model.destroy({ truncate: true });
    log.debug(`tablesTruncate: Modelo ${model.name} truncado!`);
  });
  log.info('Fin del truncado.');
};

export { dbSync, tablesTruncate };
