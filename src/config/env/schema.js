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
};
