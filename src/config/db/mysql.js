import configEnv from '../env/config';

export default {
  development: {
    use_env_variable: true,
    username: configEnv.get('db.user'),
    password: configEnv.get('db.password'),
    database: configEnv.get('db.name'),
    host: configEnv.get('db.host'),
    port: configEnv.get('db.port'),
    dialect: configEnv.get('db.dialect'),
  },
  test: {
    username: configEnv.get('db.user'),
    password: configEnv.get('db.password'),
    database: configEnv.get('db.name'),
    host: configEnv.get('db.host'),
    port: configEnv.get('db.port'),
    dialect: configEnv.get('db.dialect'),
  },
  production: {
    username: configEnv.get('db.user'),
    password: configEnv.get('db.password'),
    database: configEnv.get('db.name'),
    host: configEnv.get('db.host'),
    port: configEnv.get('db.port'),
    dialect: configEnv.get('db.dialect'),
    /* dialectOptions: {
      ssl: {
        ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
      }
    } */
  },
};
