import createLogger from 'logging';
import configEnv from '../config/env/config';

const logger = createLogger(configEnv.get('app.name'));

export { logger };
