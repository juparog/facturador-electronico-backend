import { Model } from 'sequelize';

export class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        firstName: {
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING(50),
          unique: true,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(120),
          unique: true,
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        nit: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        state: {
          type: DataTypes.ENUM,
          values: [ 'ACTIVE', 'INACTIVE' ],
          defaultValue: 'ACTIVE',
        },
      },
      {
        tableName: 'Users',
        sequelize,
      }
    );
  }

  // static associate(models) {
  //   // define association here
  // }

  // static getId(where) {
  //   // como envolver consultas
  //   return this.findOne({
  //     where,
  //     attributes: [ 'id' ],
  //     order: [ [ 'createdAt', 'DESC' ] ],
  //   });
  // }
}
