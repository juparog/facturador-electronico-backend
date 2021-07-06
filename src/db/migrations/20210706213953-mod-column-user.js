module.exports = {
  up: async (queryInterface) => Promise.all([
    queryInterface.renameColumn('Users', 'nit', 'documentNumber'),
  ]),

  down: async (queryInterface) => Promise.all([
    queryInterface.renameColumn('Users', 'documentNumber', 'nit'),
  ]),
};
