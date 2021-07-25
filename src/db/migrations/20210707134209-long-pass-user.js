module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING(256),
    }),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING(50),
    }),
  ]),
};
