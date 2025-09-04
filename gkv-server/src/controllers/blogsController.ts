import {Request, Response} from 'express'
import Blog from '../models/BlogModel'
import cloudinary from '../config/cloudinary'
import streamifier from 'streamifier'
import {slugify} from '../utils/slugify'
import {Op} from 'sequelize'

// Create blog
export const addBlog = async (req: Request, res: Response) => {
  try {
    const {title, content, author, published} = req.body
    const file = req.file
    let thumbnailUrl = ''
    const slug = slugify(title)

    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {folder: 'blogs', use_filename: true},
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        streamifier.createReadStream(file.buffer).pipe(uploadStream)
      })
      thumbnailUrl = (result as any).secure_url
    }

    const newBlog = await Blog.create({
      title,
      content,
      slug,
      author,
      published: published ?? false,
      thumbnail: thumbnailUrl,
    })

    res.status(201).json(newBlog)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Get all blogs (with pagination + search + filter published)
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const offset = (page - 1) * limit
    const {search, published} = req.query

    const whereClause: any = {}

    if (search) {
      whereClause[Op.or] = [
        {title: {[Op.like]: `%${search}%`}},
        {content: {[Op.like]: `%${search}%`}},
      ]
    }

    if (published !== undefined) {
      whereClause.published = published === 'true'
    }

    const [totalItems, blogs] = await Promise.all([
      Blog.count({where: whereClause}),
      Blog.findAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      }),
    ])

    res.status(200).json({
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      data: blogs,
    })
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Get blog by ID
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const blog = await Blog.findByPk(id)
    if (!blog) {
      res.status(404).json({message: 'Blog not found'})
    }
    res.json(blog)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Get blog by slug
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const {slug} = req.params
    const blog = await Blog.findOne({where: {slug}})
    if (!blog) {
      res.status(404).json({message: 'Blog not found'})
    }
    res.json(blog)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Update blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const {title, published} = req.body
    const slug = title ? slugify(title) : undefined
    const existing = await Blog.findByPk(id)

    if (!existing) {
      res.status(404).json({message: 'Blog not found'})
    } else {
      let thumbnailUrl = existing.thumbnail
      const file = req.file
      if (file) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {folder: 'blogs', use_filename: true},
            (error, result) => {
              if (error) return reject(error)
              resolve(result)
            }
          )
          streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })

        thumbnailUrl = (result as any).secure_url

        await existing.update({
          ...req.body,
          thumbnail: thumbnailUrl,
          ...(slug && {slug}),
          published: published ?? existing.published,
        })
      }
    }

    res.json(existing)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Delete blog
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    await Blog.destroy({where: {id}})
    res.json({message: 'Blog deleted successfully'})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}
