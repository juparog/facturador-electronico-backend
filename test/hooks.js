import {logger} from '../src/helpers/console'
import {db as models} from '../src/models';
before(async () => {
  logger.info(' ::: Iniciando la configuracion de test');
  logger.info(' ::: Sincronizando la base de datos...');
  await models.sequelize.sync({ force: true })
    .then(function() {
      logger.info(' ::: Sincronizacion completa!');
    })
    .catch( err => {
      logger.error(` ::: No se pudo sincronizar la base de datos, error: ${err}`);
    });
});

after(async () => {
  logger.info(' ::: Limpiando la configuracion de test');
  Object.values(models).map(model => {
    return model.destroy({ truncate: true });
  }); 
});
