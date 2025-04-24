import dotenv from 'dotenv'
import {Sequelize} from 'sequelize'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
  }
)

export default sequelize
