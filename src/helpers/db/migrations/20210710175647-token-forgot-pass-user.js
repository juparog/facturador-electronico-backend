export default {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Users', 'passwordResetToken', {
      type: Sequelize.STRING(1000),
    }),
  ]),

  down: async (queryInterface) => Promise.all([ queryInterface.removeColumn('Users', 'passwordResetToken') ]),
};
