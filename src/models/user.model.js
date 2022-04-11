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
          type: DataTypes.STRING(256),
          unique: {
            args: true,
            msg: 'El nombre de usuario debe ser unico.',
          },
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(256),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(120),
          unique: true,
          allowNull: false,
          validate: {
            isEmail: {
              args: true,
              msg: 'El correo tiene un formato no valido.',
            },
            max: {
              args: 120,
              msg: 'El correo excede el tamaño de maximo 120 caracteres.',
            },
          },
        },
        documentNumber: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
        },
        status: {
          type: DataTypes.ENUM,
          values: [ 'ACTIVE', 'INACTIVE' ],
          defaultValue: 'ACTIVE',
        },
        passwordResetToken: {
          type: DataTypes.STRING(1000),
        },
      },
      {
        tableName: 'Users',
        defaultScope: {
          where: { status: 'ACTIVE' },
          attributes: { exclude: [ 'password', 'passwordResetToken' ] },
        },
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
