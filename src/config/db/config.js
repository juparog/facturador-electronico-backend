import { merge } from 'webpack-merge';
import { configEnv } from '../env/config';
import common from './common';
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

const outputConfig = merge(
  common,
  grouperConfig[`${configEnv.get('db.dialect')}`]
);

logger.info('* Configuracion cargada correctamente');
logger.info(
  '-------------------------------------------------------------------'
);
logger.info('');

export default outputConfig;
