module.exports = {
  up: async (queryInterface) => Promise.all([
    queryInterface.addConstraint('Users', {
      fields: [ 'documentNumber' ],
      type: 'unique',
      name: 'documentNumber',
    }),
  ]),

  down: async (queryInterface) => Promise.all([ queryInterface.removeConstraint('Users', 'documentNumber') ]),
};
