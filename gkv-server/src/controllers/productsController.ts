import {Request, Response} from 'express'
import Product from '../models/ProductModel'
import cloudinary from '../config/cloudinary'
import streamifier from 'streamifier'
import {slugify} from '../utils/slugify'
import {Op} from 'sequelize'
import {GoogleGenerativeAI} from '@google/generative-ai'
import sanitizeHtml from 'sanitize-html'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

// Create
export const addProduct = async (req: Request, res: Response) => {
  try {
    const {name, typeId, price, stock, description, description2, old_price} = req.body
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
      isFeatured: 0,
      old_price,
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
    const {typeId, brandId, search, featured} = req.query

    const whereClause: any = {}
    if (typeId) {
      const typeIds = (typeId as string).split(',').map((id) => Number(id))
      whereClause.typeId = {[Op.in]: typeIds}
    }

    if (brandId) {
      whereClause.brandId = brandId
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

// AI tư vấn sản phẩm theo id
export const askGemini = async (req: Request, res: Response) => {
  try {
    const {Id, question} = req.body
    const product = await Product.findByPk(Id)
    if (!product) {
      res.status(404).json({message: 'Sản phẩm không tồn tại'})
    } else {
      const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'})

      const prompt = `
Bạn là trợ lý tư vấn sản phẩm chuyên nghiệp. 
Dưới đây là thông tin sản phẩm:
[THÔNG TIN SẢN PHẨM]
Tên: ${product.name}
Mô tả: ${product.description}
Giá: ${product.price} VND
- Dùng tên sản phẩm để tìm thêm thông tin trên Google

[NGƯỜI DÙNG HỎI]
${question}

Yêu cầu trả **DUY NHẤT** HTML (không kèm text giải thích ngoài HTML). 

[HƯỚNG DẪN XUẤT KẾT QUẢ]
- Trả lời dưới dạng HTML hợp lệ (chỉ dùng <h3>, <p>, <ul>, <li>, <b>, <a>)
- Không thêm Markdown (ví dụ dấu gạch ngang, in đậm, code block)
- Không thêm bất kỳ văn bản ngoài HTML
- Tiêu đề chính <h3>
- Đoạn tóm tắt ngắn trong <p>
- Mục "Ưu điểm" và "Hạn chế" dưới dạng <ul><li>
- Gợi ý "Ai phù hợp" dưới dạng <p><strong>Ai phù hợp:</strong> ...
- Gợi ý hành động (CTA) dưới dạng <a href="..." class="btn-cta">Mua ngay</a>
- Nếu có gợi ý sản phẩm thay thế, đưa dưới danh sách có link (dùng <a>)
- Tránh javascript inline (không dùng <script>), chỉ HTML thuần.

Ví dụ format trả về:
<h3>Tiêu đề</h3>
<p>tóm tắt...</p>
<ul><li>Ưu: ...</li><li>Ưu: ...</li></ul>
<ul><li>Hạn chế: ...</li></ul>
<p><strong>Ai phù hợp:</strong> ...</p>
<p><a href="https://example.com/product/123" class="btn-cta">Mua ngay</a></p>

Trả HTML ngắn gọn, thân thiện, tối đa ~300 từ.
    `

      const result = await model.generateContent(prompt)
      let html = result.response.text()

      // sanitize: chỉ cho phép các tag cần thiết và attribute href
      const clean = sanitizeHtml(html, {
        allowedTags: [
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'b',
          'i',
          'strong',
          'em',
          'u',
          'p',
          'ul',
          'ol',
          'li',
          'a',
          'br',
          'span',
          'div',
        ],
        allowedAttributes: {
          a: ['href', 'target', 'rel', 'title'],
          span: ['class'],
          div: ['class'],
        },
        transformTags: {
          a: function (tagName, attribs) {
            // ensure links open in new tab and no referrer
            return {
              tagName: 'a',
              attribs: {
                href: attribs.href || '#',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
              },
            }
          },
        },
      })

      res.json({html: clean})
    }
  } catch (err: any) {
    console.error('Gemini error:', err)
    res.status(500).json({error: err.message})
  }
}
