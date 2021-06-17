import { Model } from 'sequelize';

export class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        username: DataTypes.STRING(50),
        password: DataTypes.STRING(50),
        email: DataTypes.STRING(120),
        nit: DataTypes.STRING(20),
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

  static getId(where) {
    // como envolver consultas
    return this.findOne({
      where,
      attributes: [ 'id' ],
      order: [ [ 'createdAt', 'DESC' ] ],
    });
  }
}
