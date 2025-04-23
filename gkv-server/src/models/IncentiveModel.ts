import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../config/db' // your Sequelize instance

interface IncentiveAttributes {
  id: number
  name: string
  image: string
  order: number
}

type IncentiveCreationAttributes = Optional<IncentiveAttributes, 'id' | 'image' | 'order'>

class Incentive
  extends Model<IncentiveAttributes, IncentiveCreationAttributes>
  implements IncentiveAttributes
{
  public id!: number
  public name!: string
  public image!: string
  public slug!: string
  public order!: number
}

Incentive.init(
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
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'incentives',
    timestamps: false,
  }
)

export default Incentive
