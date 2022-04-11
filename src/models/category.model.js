import { Model } from 'sequelize';

export class Category extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(256),
          allowNull: false,
          unique: {
            args: true,
            msg: 'El nombre de la categoria debe ser único.',
          },
        },
        parent: {
            type: DataTypes.INTEGER,
        },
        description: {
          type: DataTypes.STRING(1000),
        },
        status: {
          type: DataTypes.ENUM,
          values: [ 'ACTIVE', 'INACTIVE' ],
          defaultValue: 'ACTIVE',
        },
      },
      {
        tableName: 'Categories',
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
