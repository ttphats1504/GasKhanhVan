import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRouter from './src/routers/user'
import productRoutes from './src/routers/productRoutes'
import categoryRoutes from './src/routers/categoryRoutes'
import cors from 'cors'
import {mysqlDB} from './src/database/mysql'
import Product from './src/models/ProductModel'
import Category from './src/models/CategoryModel'

dotenv.config()

const PORT = process.env.PORT || 3001

// mongoose connection pool
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.dh8fo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const app = express()
const bodyParser = require('body-parser')

app.use(cors())
app.use(express.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

const connectMongoDB = async () => {
  try {
    await mongoose.connect(dbURL)

    console.log(`Connect to db successfully!!!`)
  } catch (error) {
    console.log(`Can not connect to db ${error}`)
  }
}

const connectMySQL = async () => {
  try {
    const connection = await mysqlDB.getConnection()
    await connection.query('SELECT 1') // simple query to test the connection
    connection.release()

    console.log('Connected to MySQL successfully!!!')
  } catch (error) {
    console.error(`Cannot connect to MySQL: ${error}`)
    process.exit(1)
  }
}

app.use('/auth', userRouter)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

const startServer = async () => {
  await Product.sync({alter: true}) // syncs model with table structure
  await Category.sync({alter: true}) // syncs model with table structure
  await connectMongoDB()
  await connectMySQL()

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
})

export default app
