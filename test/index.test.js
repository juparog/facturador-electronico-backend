import { expect, server, configEnv, BASE_URL } from './setup';

const urlResponse200Test = (info, urlPath, responseMessage) => {
  it(info, (done) => {
    server
      .get(`${BASE_URL}/${urlPath}`)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(responseMessage);
        done();
      });
  });
};

describe('Index page test', () => {
  urlResponse200Test(
    'gets base url',
    '/',
    'Bienvenido a la api de Facturador Electrónico.'
  );

  urlResponse200Test('gets /envtest url', '/envtest', configEnv.get('envtest'));
});
