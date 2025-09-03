// src/models/BrandModel.ts
import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../config/db'

interface BrandAttributes {
  id: number
  name: string
  image?: string | null
  slug: string
  order: number
  createdAt?: Date
  updatedAt?: Date
}

type BrandCreationAttributes = Optional<
  BrandAttributes,
  'id' | 'image' | 'slug' | 'order' | 'createdAt' | 'updatedAt'
>

class Brand extends Model<BrandAttributes, BrandCreationAttributes> implements BrandAttributes {
  public id!: number
  public name!: string
  public image!: string | null
  public slug!: string
  public order!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Brand.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
  },
  {
    sequelize,
    tableName: 'brands',
    timestamps: true,
  }
)

export default Brand
