import { configEnv } from '../env/config';

// sobrescriba o agregue configuracion a conexion commun para conexion con postgres
export default {
  production: {
    useEnvVariable: configEnv.get('db.useEnvVariable'),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
