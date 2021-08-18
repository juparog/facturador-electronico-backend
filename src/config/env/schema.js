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
    supportEmail: {
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
    accessTokenExpirationTime: {
      doc: 'Tiempo de expiracion para el token de acceso.',
      format: String,
      default: '1d',
      env: 'APP_ACCESS_TOKEN_EXPIRATION',
    },
    urlClient: {
      doc: 'Url del cliente.',
      format: String,
      default: 'http://localhost',
      env: 'APP_URL_CLIENT',
    },
    pathResetPassword: {
      doc: 'Ruta del cliente para restablecer la contraseña',
      format: String,
      default: 'auth/reset-password',
      env: 'SMTP_RESET_PASSWORD',
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
    logging: {
      doc: 'Impresion del log para las orperaciones en la base de datos.',
      format: Boolean,
      default: true,
      env: 'DB_LOGGING',
    },
  },
  smtp: {
    service: {
      doc: 'Tipo de servicio smtp.',
      format: [ 'gmail', 'outlook', 'zoho' ],
      default: 'gmail',
      env: 'SMTP_SERVICE',
    },
    host: {
      doc: 'Host smtp para enviar el correo.',
      format: String,
      default: 'smtp.ethereal.email',
      env: 'SMTP_HOST',
    },
    user: {
      doc: 'Usuario para la autenticacion smtp.',
      format: String,
      default: 'username',
      env: 'SMTP_USER',
    },
    password: {
      doc: 'Contraseña para la autenticacion smtp.',
      format: String,
      default: '',
      env: 'SMTP_PASSWORD',
    },
  },
  sendGrid: {
    templateId: {
      doc: 'Id del template en email sendgrid/mail',
      format: String,
      default: '1-myTemplateId1234',
      env: 'SG_TEMPLATE_ID',
    },
    apiKey: {
      doc: 'Id del template en email sendgrid/mail',
      format: String,
      default: 'apyKeysengrid-email12746',
      env: 'SG_API_KEY',
    },
  }
};
