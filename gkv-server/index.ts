import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRouter from './src/routers/user'
import productRoutes from './src/routers/productRoutes'
import categoryRoutes from './src/routers/categoryRoutes'
import incentiveRoutes from './src/routers/incentiveRoutes'
import bannerRoutes from './src/routers/bannerRoutes'
import brandsRoutes from './src/routers/brandsRoutes'
import blogRoutes from './src/routers/blogRoutes'
import cors from 'cors'
import {mysqlDB} from './src/database/mysql'
import Product from './src/models/ProductModel'
import Category from './src/models/CategoryModel'
import Incentive from './src/models/IncentiveModel'
import Banner from './src/models/BannerModel'
import Brand from './src/models/BrandModel'
import Blog from './src/models/BlogModel'

dotenv.config()

const PORT = process.env.PORT || 3001

// mongoose connection pool
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.dh8fo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const app = express()
const bodyParser = require('body-parser')
const corsOptions = {
  origin: [
    'https://gkv-admin-fe.vercel.app',
    'https://gaskhanhvanquan7.vercel.app',
    'https://www.gaskhanhvan.com',
    'https://www.gaskhanhvan.com/',
  ], // replace with your actual Vercel frontend domain
  credentials: true, // if you're using cookies or authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'X-Request-With'],
}
const allowedOrigins = [
  'https://gkv-admin-fe.vercel.app',
  'https://gaskhanhvanquan7.vercel.app',
  'http://localhost:3000',
  'http://localhost:3002',
  'https://www.gaskhanhvan.com',
  'http://www.gaskhanhvan.com',
]

app.use((req, res, next) => {
  const origin = req.headers.origin as string
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin,Content-Type,Accept,Authorization,X-Requested-With'
    )
  }
  next()
})

app.options('*', cors(corsOptions))
app.use(cors(corsOptions))
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
app.use('/api/incentives', incentiveRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/brands', brandsRoutes)
app.use('/api/blogs', blogRoutes)

const startServer = async () => {
  await Product.sync({alter: true}) // syncs model with table structure
  await Category.sync({alter: true}) // syncs model with table structure
  await Incentive.sync({alter: true}) // syncs model with table structure
  await Banner.sync({alter: true}) // syncs model with table structure
  await Brand.sync({alter: true}) // syncs model with table structure
  await Blog.sync({alter: true}) // syncs model with table structure
  await connectMongoDB()
  await connectMySQL()

  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
})

export default app
