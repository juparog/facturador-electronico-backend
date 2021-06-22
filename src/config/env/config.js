import convict from 'convict';
import fs from 'fs';
import path from 'path';
import createLogger from 'logging';
import Schema from './schema';

const logger = createLogger('InitApp');

const config = convict(Schema);
const mode = config.get('env');

logger.info(
  '-------------- Configuracion de variables de entorno ---------------'
);
logger.info(`* Modo de ejecucion: ${mode}`);

const configPath = path.resolve(__dirname, `./.env.${mode}.json`);
logger.info(`* Buscando archivo de configuracion: /.env.${mode}.json`);

if (fs.existsSync(configPath)) {
  config.loadFile(configPath);
  config.validate();
  logger.info('* Archivo de configuracion cargado correctamente');
} else {
  logger.info(
    '* No se encontro el archivo, ejecutando con la configuración .env por defecto'
  );
}

logger.info(
  '-------------------------------------------------------------------'
);

module.exports = config;
