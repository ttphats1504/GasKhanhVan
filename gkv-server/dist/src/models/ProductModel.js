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
    brandId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: true },
    price: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    old_price: {
        // ✅ thêm cấu hình cho Sequelize
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
    },
    stock: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    image: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    description2: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    createdAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        unique: 'prod_slug_unique_index',
    },
    isFeatured: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0,
    },
}, {
    sequelize: db_1.default,
    tableName: 'products',
    timestamps: false,
});
exports.default = Product;
//# sourceMappingURL=ProductModel.js.map