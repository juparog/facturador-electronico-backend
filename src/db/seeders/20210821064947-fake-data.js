'use strict';
import faker, { fake } from 'faker';

module.exports = {
  up: async (queryInterface) => {
    const users = [...Array(100)].map((user) => (
      {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        password: faker.internet.password(8),
        email: faker.internet.email(),
        documentNumber: faker.datatype.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ));
    await queryInterface.bulkInsert('Users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', 
    {
      id: {
        [Sequelize.Op.gt]: 3
      }
    }, {});
  }
};
