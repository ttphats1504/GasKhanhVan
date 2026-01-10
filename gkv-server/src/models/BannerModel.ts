import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../config/db'

interface BannerAttributes {
  id: number
  image: string
  order: number
  categoryId?: number | null
}

type BannerCreationAttributes = Optional<BannerAttributes, 'id' | 'image' | 'order' | 'categoryId'>

class Banner extends Model<BannerAttributes, BannerCreationAttributes> implements BannerAttributes {
  public id!: number
  public image!: string
  public order!: number
  public categoryId!: number | null
}

Banner.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'banner_images',
    timestamps: false,
  }
)

export default Banner
