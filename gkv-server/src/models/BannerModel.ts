import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../config/db'

interface BannerAttributes {
  id: number
  image: string
  order: number
}

type BannerCreationAttributes = Optional<BannerAttributes, 'id' | 'image' | 'order'>

class Banner extends Model<BannerAttributes, BannerCreationAttributes> implements BannerAttributes {
  public id!: number
  public image!: string
  public order!: number
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
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'banner_images',
    timestamps: false,
  }
)

export default Banner
