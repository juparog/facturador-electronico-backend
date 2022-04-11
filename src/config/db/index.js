import { merge } from 'webpack-merge';
import { configEnv } from '../env/config';
import common from './common';
import mysql from './mysql';
import postgres from './postgres';
import { parentLogger, getCallerFile } from '../../helpers/logger';

const log = parentLogger.child({location: `src/config/db/${getCallerFile()}`})

log.info('Configuracion de base de datos.');
log.debug(`Cargando la configuracion: ${configEnv.get('db.dialect')}`);

const grouperConfig = {
  mysql,
  postgres,
};

const outputConfig = merge(
  common,
  grouperConfig[`${configEnv.get('db.dialect')}`]
);

log.info('Configuracion de la base de datos cargada correctamente.');

export default outputConfig;
