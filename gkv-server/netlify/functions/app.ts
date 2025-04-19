import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRouter from '../../src/routers/user.js'
import productRoutes from '../../src/routers/productRoutes.js'
import categoryRoutes from '../../src/routers/categoryRoutes.js'
import cors from 'cors'
import {mysqlDB} from '../../src/database/mysql.js'
import Product from '../../src/models/ProductModel.js'
import Category from '../../src/models/CategoryModel.js'
import serverless from 'serverless-http'
import bodyParser from 'body-parser'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Static
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/auth', userRouter)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

// DB connections
const connectMongoDB = async () => {
  const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.dh8fo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  try {
    await mongoose.connect(dbURL)
    console.log(`Connected to MongoDB successfully!`)
  } catch (err) {
    console.error('MongoDB connection failed:', err)
  }
}

const connectMySQL = async () => {
  try {
    const connection = await mysqlDB.getConnection()
    connection.release()
    console.log('Connected to MySQL successfully!')
  } catch (err) {
    console.error('MySQL connection failed:', err)
  }
}

;(async () => {
  // Call DB setup
  await connectMongoDB()
  await connectMySQL()
  await Product.sync({alter: true})
  await Category.sync({alter: true})
})()

// Export as serverless function
export const handler = serverless(app)
