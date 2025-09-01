"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db")); // your Sequelize instance
class Category extends sequelize_1.Model {
}
Category.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: 'slug_unique_index',
    },
    parentId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'categories', // self-reference
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize: db_1.default,
    tableName: 'categories',
    timestamps: false,
});
// One category can have many children
Category.hasMany(Category, {
    as: 'children',
    foreignKey: 'parentId',
});
// Each category can belong to one parent
Category.belongsTo(Category, {
    as: 'parent',
    foreignKey: 'parentId',
});
exports.default = Category;
//# sourceMappingURL=CategoryModel.js.map