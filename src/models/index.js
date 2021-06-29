import Sequelize from 'sequelize';
import { configEnv } from '../config/env/config';

// modelos
import { User } from './user';

const env = configEnv.get('env') || 'development';
const config = require('../config/db/babelHook')[env];

let sequelize;
if (config.useEnvVariable && config.useEnvVariable !== '') {
  let dbUrl = configEnv.getEnv()[config.useEnvVariable];
  if(!dbUrl){
    dbUrl = configEnv.get('db.url');
  }
  sequelize = new Sequelize(dbUrl, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// iniciar los modelos
const models = {
  User: User.init(sequelize, Sequelize),
};

// ejecutar las relaciones si existen para cada modelo
Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

const db = {
  ...models,
  sequelize,
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db };
