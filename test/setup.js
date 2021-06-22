import supertest from 'supertest';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import { name, internet, random } from 'faker';
import app from '../src/app';
import config from '../src/config/env/config';

chai.use(sinonChai);
export const { expect } = chai;
export const server = supertest.agent(app);
export const configEnv = config;
export const BASE_URL = '/api';
export const faker = { name, internet, random };
