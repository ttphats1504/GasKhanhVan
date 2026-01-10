import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'

import userRouter from './src/routers/user'
import authRoutes from './src/routers/authRoutes'
import adminUsersRoutes from './src/routers/adminUsersRoutes'
import productRoutes from './src/routers/productRoutes'
import categoryRoutes from './src/routers/categoryRoutes'
import incentiveRoutes from './src/routers/incentiveRoutes'
import bannerRoutes from './src/routers/bannerRoutes'
import brandsRoutes from './src/routers/brandsRoutes'
import blogRoutes from './src/routers/blogRoutes'
import uploadRoutes from './src/routers/uploadRoutes'

import {mysqlDB} from './src/database/mysql'
import Product from './src/models/ProductModel'
import Category from './src/models/CategoryModel'
import Incentive from './src/models/IncentiveModel'
import Banner from './src/models/BannerModel'
import Brand from './src/models/BrandModel'
import Blog from './src/models/BlogModel'

dotenv.config()

const PORT = process.env.PORT || 3001

// MongoDB connection string
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.dh8fo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const app = express()

// ✅ Setup CORS middleware
app.use(
  cors({
    origin: [
      'https://gkv-admin-fe.vercel.app',
      'https://gaskhanhvanquan7.vercel.app',
      'https://www.gaskhanhvan.com',
      'http://localhost:3000',
      'http://localhost:3002',
      'http://103.72.99.119:3001',
    ],
    credentials: true,
  })
)

// Handle preflight OPTIONS
app.options('*', cors())

// Middleware
app.use(express.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb'}))
app.use('/uploads', express.static('uploads'))

// Connect MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(dbURL)
    console.log(`✅ Connected to MongoDB successfully`)
  } catch (error) {
    console.error(`❌ Cannot connect to MongoDB: ${error}`)
  }
}

// Connect MySQL
const connectMySQL = async () => {
  try {
    const connection = await mysqlDB.getConnection()
    connection.release()
    console.log('✅ Connected to MySQL successfully')
  } catch (error) {
    console.error(`❌ Cannot connect to MySQL: ${error}`)
    process.exit(1)
  }
}

// Routes
app.use('/auth', authRoutes)
app.use('/user', userRouter)
app.use('/api/admin-users', adminUsersRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/incentives', incentiveRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/brands', brandsRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api', uploadRoutes)

// Start server
const startServer = async () => {
  // Sync models (alter: true will update existing tables)
  await Product.sync({alter: true})
  await Category.sync({alter: true})
  await Incentive.sync({alter: true})
  await Banner.sync({alter: true})
  await Brand.sync({alter: true})
  await Blog.sync({alter: true})

  await connectMongoDB()
  await connectMySQL()

  app.listen(PORT, () => {
    console.log(`🚀 Server is running at port ${PORT}`)
  })
}

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err)
})

export default app
