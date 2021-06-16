const Convict = require('convict');
const Fs = require('fs');
const Path = require('path');

const Schema = require('./schema');

const config = Convict(Schema);
const mode = config.get('env');

console.log(
  '-------------- Configuracion de variables de entorno ---------------'
);
console.log(`* Modo de ejecucion: ${mode}`);

const configPath = Path.resolve(__dirname, `./.env.${mode}.json`);
console.log(`* Buscando archivo de configuracion: ${configPath}`);

if (Fs.existsSync(configPath)) {
  config.loadFile(configPath);
  config.validate();
  console.log('* Archivo de configuracion cargado correctamente');
} else {
  console.log(
    '* No se encontro el archivo, ejecutando con la configuración .env por defecto'
  );
}

console.log(
  '-------------------------------------------------------------------'
);
console.log('');

module.exports = config;
