import supertest from 'supertest';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import app from '../src/app';
import config from '../src/config/env/config';

chai.use(sinonChai);
export const { expect } = chai;
export const server = supertest.agent(app);
export const configEnv = config;
export const BASE_URL = '/api';
