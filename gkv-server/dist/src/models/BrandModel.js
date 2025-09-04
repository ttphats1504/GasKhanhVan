"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/BrandModel.ts
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Brand extends sequelize_1.Model {
}
Brand.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    order: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
    },
    createdAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    updatedAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
}, {
    sequelize: db_1.default,
    tableName: 'brands',
    timestamps: true,
});
exports.default = Brand;
//# sourceMappingURL=BrandModel.js.map