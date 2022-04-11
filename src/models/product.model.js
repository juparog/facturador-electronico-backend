import { Model } from 'sequelize';

export class Product extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(256),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(1000),
        },
        code: {
          type: DataTypes.STRING(256),
        },
        status: {
          type: DataTypes.ENUM,
          values: [ 'ACTIVE', 'INACTIVE' ],
          defaultValue: 'ACTIVE',
        },
      },
      {
        tableName: 'Products',
        defaultScope: {
          where: { status: 'ACTIVE' },
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
