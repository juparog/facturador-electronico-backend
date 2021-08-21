module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Juan',
          lastName: 'Rodriguez',
          username: 'juparog',
          password:
            '$2a$10$QMeNlrshvB357TYweQmzGu1zAA.H4QglGqAxumr9ST1wAymkJyziu',
          email: 'juangasca95@gmail.com',
          documentNumber: '1234567890',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Efrain',
          lastName: 'Rodriguez',
          username: 'efrainrg92',
          password:
            '$2a$10$QMeNlrshvB357TYweQmzGu1zAA.H4QglGqAxumr9ST1wAymkJyziu',
          email: 'efrainrg92@gmail.com',
          documentNumber: '123456789',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Samir',
          lastName: 'Martinez',
          username: 'samir.martinez',
          password:
            '$2a$10$QMeNlrshvB357TYweQmzGu1zAA.H4QglGqAxumr9ST1wAymkJyziu',
          email: 'samir.martinez@gmail.com',
          documentNumber: '1234567891',
          status: 'INACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      'Users',
      {
        email: [
          'juangasca95@gmail.com',
          'efrainrg92@gmail.com',
          'samir.martinez@gmail.com',
        ],
      },
      {}
    );
  },
};
