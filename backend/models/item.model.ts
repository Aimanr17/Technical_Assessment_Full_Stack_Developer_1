import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface ItemAttributes {
  id?: number;
  name: string;
  description?: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Item extends Model<ItemAttributes> implements ItemAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    price: {
      type: DataTypes.DOUBLE,  // Changed to DOUBLE for better precision
      allowNull: false,
      get() {
        const value = this.getDataValue('price');
        return value === null ? null : Number(value);
      },
      validate: {
        isPositive(value: number) {
          if (value <= 0) {
            throw new Error('Price must be positive');
          }
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'items',
    timestamps: true,
  }
);

export default Item;
