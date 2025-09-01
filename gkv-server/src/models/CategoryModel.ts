import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../config/db' // your Sequelize instance

interface CategoryAttributes {
  id: number
  name: string
  image?: string | null
  slug: string
  parentId?: number | null
}

type CategoryCreationAttributes = Optional<CategoryAttributes, 'id' | 'image' | 'parentId'>

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number
  public name!: string
  public image!: string | null
  public slug!: string
  public parentId!: number | null
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'slug_unique_index',
    },
    parentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'categories', // self-reference
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: false,
  }
)

// One category can have many children
Category.hasMany(Category, {
  as: 'children',
  foreignKey: 'parentId',
})

// Each category can belong to one parent
Category.belongsTo(Category, {
  as: 'parent',
  foreignKey: 'parentId',
})

export default Category
