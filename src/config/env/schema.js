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
  app: {
    name: {
      doc: 'Nombre de la aplicacion.',
      format: String,
      default: 'AppName',
      env: 'APP_NAME',
    },
    description: {
      doc: 'Descripcion de la aplicacion.',
      format: String,
      default: 'Api de datos',
      env: 'APP_DESCRIPTION',
    },
    owner: {
      doc: 'Dueño de la aplicacion.',
      format: String,
      default: 'Owner Api',
      env: 'APP_OWNER',
    },
    email: {
      doc: 'Correo de contacto para la aplicacion.',
      format: String,
      default: 'support@api.com',
      env: 'APP_EMAIL',
    },
    url: {
      doc: 'Url de la aplicacion.',
      format: String,
      default: 'http://localhost',
      env: 'APP_URL',
    },
    urlDescription: {
      doc: 'Descripcion de la url de la aplicacion.',
      format: String,
      default: '',
      env: 'APP_URL_DESCRIPTION',
    },
    secretKey: {
      doc: 'Llave secreta para realkizar encriptacion.',
      format: String,
      default: 'jg8dsyu4kf0sedshf67sg68f8hbnjttj',
      env: 'APP_SECRET_KEY',
    },
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
      format: [ '{}', '{force:true}', '{alter:true}' ],
      default: '{}',
      env: 'DB_SYNC',
    },
    useEnvVariable: {
      doc: 'Variable para conectarce con una url directamente.',
      format: String,
      default: '',
      env: 'DB_USE_ENV_VARIABLE',
    },
    url: {
      doc: 'Url de conexion a la base de datos.',
      format: String,
      default: '',
      env: 'DB_URL',
    },
  },
};
