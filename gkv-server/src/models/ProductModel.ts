import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../config/db' // your Sequelize instance

interface ProductAttributes {
  id: number
  name: string
  typeId: number
  brandId: number
  price: number
  old_price: number // ✅ thêm trường old_price
  stock: number
  image: string
  description: string
  description2: string
  createdAt?: Date
  slug: string
  isFeatured: number // tinyint => number (0 | 1)
}

type ProductCreationAttributes = Optional<
  ProductAttributes,
  'id' | 'image' | 'typeId' | 'brandId' | 'createdAt' | 'isFeatured' | 'old_price'
>

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number
  public name!: string
  public typeId!: number
  public brandId!: number
  public price!: number
  public old_price!: number // ✅ field mới
  public stock!: number
  public image!: string
  public description!: string
  public description2!: string
  public readonly createdAt!: Date
  public slug!: string
  public isFeatured!: number
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
    brandId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: true},
    price: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    old_price: {
      // ✅ thêm cấu hình cho Sequelize
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    stock: {type: DataTypes.INTEGER, allowNull: false},
    image: {type: DataTypes.TEXT, allowNull: true},
    description: {type: DataTypes.TEXT, allowNull: false},
    description2: {type: DataTypes.TEXT, allowNull: true},
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    slug: {
      type: DataTypes.STRING,
      unique: 'prod_slug_unique_index',
    },
    isFeatured: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: false,
  }
)

export default Product
