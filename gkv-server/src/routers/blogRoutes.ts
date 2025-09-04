import express from 'express'
import upload from '../utils/multer'
import {
  addBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from '../controllers/blogsController'

const router = express.Router()

// Create
router.post('/', upload.single('thumbnail'), addBlog)

// Read
router.get('/', getAllBlogs) // ?page=1&limit=10&search=seo&published=true
router.get('/:id', getBlogById)
router.get('/slug/:slug', getBlogBySlug)

// Update
router.put('/:id', upload.single('thumbnail'), updateBlog)

// Delete
router.delete('/:id', deleteBlog)

export default router
