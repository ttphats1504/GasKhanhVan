"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db")); // your Sequelize instance
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    typeId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    price: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    image: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        unique: 'prod_slug_unique_index',
    },
}, {
    sequelize: db_1.default,
    tableName: 'products',
    timestamps: false,
});
exports.default = Product;
//# sourceMappingURL=ProductModel.js.map