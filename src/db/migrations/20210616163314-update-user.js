'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'Users',
        'firstName', {
          type: Sequelize.STRING(120),
          allowNull: false,
        }
      ),
      queryInterface.changeColumn(
        'Users',
        'lastName', {
          type: Sequelize.STRING(120),
          allowNull: false,
        }
      ),
      queryInterface.addColumn(
        'Users',
        'username', {
          type: Sequelize.STRING(50),
          unique: true,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'Users',
        'password', {
          type: Sequelize.STRING(50),
          allowNull: false
        }
      ),
      queryInterface.changeColumn(
        'Users',
        'email', {
          type: Sequelize.STRING(120),
          unique: true,
          allowNull: false,
          validate: {
              isEmail: true
          }
        }
      ),
      queryInterface.addColumn(
        'Users',
        'nit', {
          type: Sequelize.STRING(20),
          allowNull: false
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'Users',
        'firstName', {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.changeColumn(
        'Users',
        'lastName', {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.removeColumn(
        'Users',
        'username'
      ),
      queryInterface.removeColumn(
        'Users',
        'password'
      ),
      queryInterface.changeColumn(
        'Users',
        'email', {
          type: Sequelize.STRING
        }
      ),
      queryInterface.removeColumn(
        'Users',
        'nit'
      ),
    ]);
  }
};
