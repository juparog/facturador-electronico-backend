import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { configEnv } from '../env/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: `${configEnv.get('app.name')} - API`,
    version: '1.0.0',
    description: `${configEnv.get('app.description')}`,
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: `${configEnv.get('app.owner')}`,
      url: `${configEnv.get('app.supportEmail')}`,
    }
  },
  servers: [
    {
      url: `${configEnv.get('app.url')}`,
      description: `${configEnv.get('app.urlDescription')}`,
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [
    `${path.join(__dirname, '../../docs/*.yaml')}`
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };
