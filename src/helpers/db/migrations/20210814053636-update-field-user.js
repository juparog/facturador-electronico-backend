module.exports = {
  up: async (queryInterface) => Promise.all([ queryInterface.renameColumn('Users', 'state', 'status') ]),

  down: async (queryInterface) => Promise.all([ queryInterface.renameColumn('Users', 'status', 'state') ]),
};
