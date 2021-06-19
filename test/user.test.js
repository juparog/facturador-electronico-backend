import { expect, server, BASE_URL, faker } from './setup';

describe('User test', () => {
  it('gets list user url', (done) => {
    server
      .get(`${BASE_URL}/users`)
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

  it('create user url', (done) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const data = {
      firstName,
      lastName,
      username: faker.internet.userName(firstName, lastName),
      password: faker.internet.password(8),
      email: faker.internet.email(firstName, lastName),
      nit: faker.random.alphaNumeric(10),
    };
    server
      .post(`${BASE_URL}/users`)
      .send(data)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.instanceOf(Object);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('firstName');
        expect(res.body.data).to.have.property('lastName');
        expect(res.body.data).to.have.property('username');
        expect(res.body.data).to.have.property('password');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data).to.have.property('nit');
        expect(res.body.data).to.have.property('createdAt');
        expect(res.body.data).to.have.property('updatedAt');
        done();
      });
  });

  it('update user url', (done) => {
    const id = 1;
    const data = {
      password: faker.internet.password(8),
    };
    server
      .put(`${BASE_URL}/users/${id}`)
      .send(data)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.instanceOf(Object);
        expect(res.body.data).to.have.property('password');
        done();
      });
  });

  it('delete user url', (done) => {
    const id = 1;
    const data = {
      password: faker.internet.password(8),
    };
    server
      .delete(`${BASE_URL}/users/${id}`)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        console.log(res.body.data);
        expect(res.body.data).to.be.instanceOf(Object);
        expect(res.body.data).to.have.property('id');
        done();
      });
  });
});
