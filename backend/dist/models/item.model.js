"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Item extends sequelize_1.Model {
}
Item.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.DOUBLE, // Changed to DOUBLE for better precision
        allowNull: false,
        get() {
            const value = this.getDataValue('price');
            return value === null ? null : Number(value);
        },
        validate: {
            isPositive(value) {
                if (value <= 0) {
                    throw new Error('Price must be positive');
                }
            },
        },
    },
}, {
    sequelize: database_1.default,
    tableName: 'items',
    timestamps: true,
});
exports.default = Item;
//# sourceMappingURL=item.model.js.map