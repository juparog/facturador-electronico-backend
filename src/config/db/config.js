import configEnv from '../env/config';
import mysql from './mysql';
import postgres from './postgres';
import { logger } from '../../helpers/console';

logger.info(
  '----------------- Configuracion de base de datos ------------------'
);
logger.info(`* Cargando la configuracion: ${configEnv.get('db.dialect')}`);

const grouperConfig = {
  mysql,
  postgres,
};

logger.info('* Configuracion cargada correctamente');
logger.info(
  '-------------------------------------------------------------------'
);
logger.info('');

export default grouperConfig[`${configEnv.get('db.dialect')}`];
