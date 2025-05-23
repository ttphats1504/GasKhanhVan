import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../config/db' // your Sequelize instance

interface ProductAttributes {
  id: number
  name: string
  typeId: number
  price: number
  stock: number
  image: string
  description: string
  createdAt?: Date
}

type ProductCreationAttributes = Optional<ProductAttributes, 'id' | 'image' | 'createdAt'>

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number
  public name!: string
  public typeId!: number
  public price!: number
  public stock!: number
  public image!: string
  public description!: string
  public readonly createdAt!: Date
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {type: DataTypes.STRING, allowNull: false},
    typeId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false},
    price: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    stock: {type: DataTypes.INTEGER, allowNull: false},
    image: {type: DataTypes.TEXT, allowNull: true},
    description: {type: DataTypes.TEXT, allowNull: false},
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: false,
  }
)

export default Product
