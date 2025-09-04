"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Blog extends sequelize_1.Model {
}
Blog.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT('long'), // lưu HTML hoặc Markdown
        allowNull: false,
    },
    thumbnail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    author: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    published: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    updatedAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
}, {
    sequelize: db_1.default,
    tableName: 'blogs',
    timestamps: true,
});
exports.default = Blog;
//# sourceMappingURL=BlogModel.js.map