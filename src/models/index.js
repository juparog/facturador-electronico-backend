import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import configEnv from '../config/env/config';

// modelos
import {User} from './user';

const basename = path.basename(__filename);
const env = configEnv.get('env') || 'development';
const config = require(`${__dirname}/../config/db/babelHook.js`)[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

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
