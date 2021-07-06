import { db as models } from '../models';
import { logger } from './console';

const dbSync = async (options) => {
  logger.info(' ::: Sincronizando la base de datos...');
  logger.info(' ::: Opciones de sincronizacion: ', options);
  await models.sequelize.sync(options);
  logger.info(' ::: Sincronizacion completa!');
};

const tablesTruncate = async () => {
  logger.info(' ::: Truncando las tablas de la DB...');
  Object.values(models).map(async (model) => {
    await model.destroy({ truncate: true });
    logger.info(` ::: Modelo ${model.name} truncado!`);
  });
};

export { dbSync, tablesTruncate };
