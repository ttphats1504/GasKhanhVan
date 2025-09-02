import {Request, Response} from 'express'
import Product from '../models/ProductModel'
import cloudinary from '../config/cloudinary'
import streamifier from 'streamifier'
import {slugify} from '../utils/slugify'
import {Op} from 'sequelize'

// Create
export const addProduct = async (req: Request, res: Response) => {
  try {
    const {name, typeId, price, stock, description, description2} = req.body
    const file = req.file
    let imageUrl = ''
    const slug = slugify(name)

    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            use_filename: true,
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )

        streamifier.createReadStream(file.buffer).pipe(uploadStream)
      })

      imageUrl = (result as any).secure_url
    }

    const newProduct = await Product.create({
      name,
      typeId,
      price,
      stock,
      description,
      image: imageUrl,
      slug,
      description2,
    })

    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read All
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const offset = (page - 1) * limit
    const {typeId, search, featured} = req.query

    const whereClause: any = {}
    if (typeId) {
      whereClause.typeId = typeId // lọc theo typeId
    }

    if (search) {
      whereClause[Op.or] = [{name: {[Op.like]: `%${search}%`}}]
    }

    if (featured === 'true') {
      whereClause.isFeatured = 1 // tinyint
    }

    const [totalItems, products] = await Promise.all([
      Product.count({where: whereClause}),
      Product.findAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']], // optional: sắp xếp mới nhất
      }),
    ])

    res.status(200).json({
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      data: products,
    })
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read One
export const getProductById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const product = await Product.findByPk(id)
    if (!product) {
      res.status(404).json({message: 'Product not found'})
      return
    }
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read One by Name
export const getProductByName = async (req: Request, res: Response) => {
  try {
    const {name} = req.params

    const product = await Product.findOne({
      where: {name},
    })

    if (!product) {
      res.status(404).json({message: 'Product not found'})
    }

    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const {slug} = req.params
    const product = await Product.findOne({where: {slug}})

    if (!product) {
      res.status(404).json({message: 'Product not found'})
    }

    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// controllers/productsController.ts
export const setFeatured = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const {isFeatured} = req.body

    const product = await Product.findByPk(id)
    if (!product) {
      res.status(404).json({message: 'Product not found'})
    } else {
      console.log(isFeatured)
      product.isFeatured = isFeatured ? 1 : 0
      await product.save()
    }
    res.json({message: 'Updated featured status', product})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Update
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const {name} = req.body
    const slug = name ? slugify(name) : undefined
    const file = req.file
    const existing = await Product.findByPk(id)
    if (!existing) {
      res.status(404).json({message: 'Product not found'})
      return
    }

    let imageUrl = existing.image
    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            use_filename: true,
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )

        streamifier.createReadStream(file.buffer).pipe(uploadStream)
      })

      imageUrl = (result as any).secure_url
    }

    await existing.update({...req.body, image: imageUrl, ...(slug && {slug})})
    res.status(200).json(existing)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Delete
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    await Product.destroy({where: {id}})
    res.status(200).json({message: 'Product deleted successfully'})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}
