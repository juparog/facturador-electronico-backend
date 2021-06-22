import { expect, server, BASE_URL, faker } from './setup';
import { dbSync } from '../src/helpers/db';

describe('Db test', () => {
  it('sycn db mode=force', (done) => {
    dbSync({ force: true });
    done();
  });

  it('sycn db mode=alter', (done) => {
    dbSync();
    done();
  });
});
