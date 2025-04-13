import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../config/db' // your Sequelize instance

interface CategoryAttributes {
  id: number
  name: string
  image: string
}

type CategoryCreationAttributes = Optional<CategoryAttributes, 'id' | 'image'>

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number
  public name!: string
  public image!: string
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
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: false,
  }
)

export default Category
