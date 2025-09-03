// src/controllers/brandsController.ts
import {Request, Response} from 'express'
import Brand from '../models/BrandModel'
import {slugify} from '../utils/slugify'
import streamifier from 'streamifier'
import cloudinary from '../config/cloudinary'

// create brand
export const addBrand = async (req: Request, res: Response) => {
  try {
    const {name, order} = req.body
    const file = req.file
    let imageUrl = null
    const slug = slugify(name)

    if (file) {
      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {folder: 'brands', use_filename: true},
          (err, result) => {
            if (err) return reject(err)
            resolve(result)
          }
        )
        streamifier.createReadStream(file.buffer).pipe(uploadStream)
      })
      imageUrl = result.secure_url
    }

    const brand = await Brand.create({
      name,
      image: imageUrl,
      slug,
      order: order ? parseInt(order) : 0,
    })

    res.status(201).json(brand)
  } catch (err: any) {
    console.error('❌ Add Brand Error:', err)
    if (err.name === 'ValidationError') {
      res.status(400).json({error: err.message, details: err.errors})
    }
    res.status(500).json({error: err.message})
  }
}

// get all (with pagination & search)
export const getBrands = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || '1')
    const limit = parseInt((req.query.limit as string) || '20')
    const offset = (page - 1) * limit
    const search = (req.query.search as string) || ''

    const where: any = {}
    if (search) {
      where.name = {$like: `%${search}%`} // for sequelize v5 maybe Op.like; adjust based on your setup
    }

    // prefer Op import if using modern Sequelize:
    // import { Op } from 'sequelize' and use Op.like

    const {count, rows} = await Brand.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['order', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    })

    res.json({page, limit, totalItems: count, data: rows})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// get by id
export const getBrandById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const brand = await Brand.findByPk(id)
    if (!brand) {
      res.status(404).json({message: 'Brand not found'})
    }
    res.json(brand)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// update
export const updateBrand = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const {name, order} = req.body
    const file = req.file

    const brand = await Brand.findByPk(id)
    if (!brand) {
      res.status(404).json({message: 'Brand not found'})
    } else {
      let imageUrl = brand.image
      if (file) {
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {folder: 'brands', use_filename: true},
            (err, result) => {
              if (err) return reject(err)
              resolve(result)
            }
          )
          streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
        imageUrl = result.secure_url
      }

      // update slug if name changed
      let slug = brand.slug
      if (name && name !== brand.name) {
        const base = slugify(name)
        let candidate = base
        let counter = 1
        while (await Brand.findOne({where: {slug: candidate, id: {$ne: brand.id}}})) {
          candidate = `${base}-${counter++}`
        }
        slug = candidate
      }

      await brand.update({
        name: name ?? brand.name,
        image: imageUrl,
        slug,
        order: order !== undefined ? parseInt(order) : brand.order,
      })
    }
    res.json(brand)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// delete
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    await Brand.destroy({where: {id}})
    res.json({message: 'Brand deleted'})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// set order bulk (accepts [{id, order}, ...])
export const reorderBrands = async (req: Request, res: Response) => {
  try {
    const updates: {id: number; order: number}[] = req.body
    if (!Array.isArray(updates)) {
      res.status(400).json({message: 'Invalid payload'})
    }

    await Promise.all(updates.map((u) => Brand.update({order: u.order}, {where: {id: u.id}})))

    res.json({message: 'Order updated'})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}
