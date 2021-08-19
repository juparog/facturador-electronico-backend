import db from '../models';
import { logger } from './console';

const dbSync = async (options) => {
  logger.info(' ::: helpers.db.dbSync: Sincronizando la base de datos...');
  logger.info(' ::: helpers.db.dbSync: Opciones de sincronizacion: ', options);
  await db.sequelize.sync(options);
  logger.info(' ::: helpers.db.dbSync: Sincronizacion completa!');
};

const tablesTruncate = async () => {
  logger.info(' ::: helpers.db.tablesTruncate: Truncando las tablas de la DB...');
  Object.values(db).map(async (model) => {
    await model.destroy({ truncate: true });
    logger.info(` ::: helpers.db.tablesTruncate: Modelo ${model.name} truncado!`);
  });
};

export { dbSync, tablesTruncate };
