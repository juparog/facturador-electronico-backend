module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Users', 'state', {
      type: Sequelize.ENUM,
      values: [ 'ACTIVE', 'INACTIVE' ],
      defaultValue: 'ACTIVE',
    }),
  ]),

  down: async (queryInterface) => Promise.all([ queryInterface.removeColumn('Users', 'state') ]),
};
