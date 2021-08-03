import { configEnv } from '../env/config';

export default {
  development: {
    username: configEnv.get('db.user'),
    password: configEnv.get('db.password'),
    database: configEnv.get('db.name'),
    host: configEnv.get('db.host'),
    port: configEnv.get('db.port'),
    dialect: configEnv.get('db.dialect'),
    logging: configEnv.get('db.logging'),
  },
  test: {
    username: configEnv.get('db.user'),
    password: configEnv.get('db.password'),
    database: configEnv.get('db.name'),
    host: configEnv.get('db.host'),
    port: configEnv.get('db.port'),
    dialect: configEnv.get('db.dialect'),
    logging: configEnv.get('db.logging'),
  },
  production: {
    username: configEnv.get('db.user'),
    password: configEnv.get('db.password'),
    database: configEnv.get('db.name'),
    host: configEnv.get('db.host'),
    port: configEnv.get('db.port'),
    dialect: configEnv.get('db.dialect'),
    logging: configEnv.get('db.logging'),
  },
};
