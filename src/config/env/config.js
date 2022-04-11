import convict from 'convict';
import fs from 'fs';
import path from 'path';
import Schema from './schema';

const config = convict(Schema);
const mode = config.get('env');


const configPath = path.resolve(__dirname, `./.env.${mode}.json`);
process.stdout.write(`* Buscando archivo de configuracion: /.env.${mode}.json \n`);

if (fs.existsSync(configPath)) {
  config.loadFile(configPath);
  config.validate();
  process.stdout.write('* Archivo de configuracion cargado correctamente \n');
} else {
  process.stdout.write(
    '* No se encontro el archivo, ejecutando con la configuración .env por defecto \n'
  );
}

export const configEnv = config;
