import { expect, server, BASE_URL, faker } from './setup';

describe('Test para Autenticacion y Autorizacion', () => {
  it('login de un usuario', (done) => {
    const data = {
      nit: '1234567890',
      email: 'juparog@email.com',
      password: 'Abc123456',
    };
    server
      .post(`${BASE_URL}/auth/login`)
      .send(data)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.instanceOf(Object);
        expect(res.body.data).to.have.property('accessToken');
        done();
      });
  });
});
