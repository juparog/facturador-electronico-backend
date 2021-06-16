module.exports = {
  env: {
    doc: 'El entorno de la aplicación.',
    format: [ 'production', 'development', 'test' ],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'Puerto para escuchar el servicio.',
    format: 'port',
    default: 4001,
    env: 'PORT',
  },
  db: {
    dialect: {
      doc: 'Tipo de base de datos (dialecto).',
      format: [ 'mysql', 'mariadb', 'sqlite', 'postgres', 'mssql' ],
      default: 'mysql',
      env: 'DB_DIALECT',
    },
    host: {
      doc: 'Host de base de datos.',
      format: String,
      default: 'localhost',
      env: 'DB_HOST',
    },
    port: {
      doc: 'Puerto de base de datos.',
      format: 'port',
      default: 3306,
      env: 'DB_PORT',
    },
    name: {
      doc: 'Nombre de la base de datos.',
      format: String,
      default: 'example_db',
      env: 'DB_NAME',
    },
    user: {
      doc: 'Usuario de la base de datos.',
      format: String,
      default: 'root',
      env: 'DB_USER',
    },
    password: {
      doc: 'Contraseña de la base de datos.',
      format: String,
      default: '',
      env: 'DB_PASSWORD',
    },
    sync: {
      doc: 'Metodo de sincroniizacion para la db.',
      format: [ '', 'force', 'alter' ],
      default: '',
      env: 'DB_SYNC',
    },
  },
};
