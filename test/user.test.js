import { expect, server, configEnv, BASE_URL } from './setup';

describe('User test', () => {
  it('gets list user url', (done) => {
    server
      .get(`${BASE_URL}/user`)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.instanceOf(Array);
        res.body.data.forEach((element) => {
          expect(element).to.have.property('id');
          expect(element).to.have.property('firstName');
          expect(element).to.have.property('lastName');
          expect(element).to.have.property('username');
          expect(element).to.have.property('password');
          expect(element).to.have.property('email');
          expect(element).to.have.property('nit');
          expect(element).to.have.property('createdAt');
          expect(element).to.have.property('updatedAt');
        });
        done();
      });
  });
});
