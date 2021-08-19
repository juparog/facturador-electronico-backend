import createLogger from 'logging';
import { configEnv } from '../config/env/config';

const options = configEnv.get('app.logging') ? {} : { logFunction: () => {} };

const logger = createLogger(configEnv.get('app.name'), options);

export { logger };
