import db from '../models';
import { logger } from './console';

const dbSync = async (mode) => {
  logger.info(' ::: helpers.db.dbSync: Sincronizando la base de datos...');
  const options = mode !== '' ? JSON.parse(`{"${mode}":true}`) : {};
  logger.info(' ::: helpers.db.dbSync: Opciones de sincronizacion: ', options);
  return db.sequelize
    .sync(options)
    .then(() => logger.info(' ::: helpers.db.dbSync: Sincronizacion completa!'))
    .catch((err) => logger.error(' ::: helpers.db.dbSync: Error sincronizando la db, ', err));
};

const tablesTruncate = async () => {
  logger.info(
    ' ::: helpers.db.tablesTruncate: Truncando las tablas de la DB...'
  );
  Object.values(db).map(async (model) => {
    await model.destroy({ truncate: true });
    logger.info(
      ` ::: helpers.db.tablesTruncate: Modelo ${model.name} truncado!`
    );
  });
};

export { dbSync, tablesTruncate };
