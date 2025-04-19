import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../config/db' // your Sequelize instance

interface CategoryAttributes {
  id: number
  name: string
  image: string
  slug: string
}

type CategoryCreationAttributes = Optional<CategoryAttributes, 'id' | 'image'>

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number
  public name!: string
  public image!: string
  public slug!: string
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
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: false,
  }
)

export default Category
