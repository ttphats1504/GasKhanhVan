import express from 'express'
import multer from 'multer'
import {
  addProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  getProductBySlug,
  setFeatured,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController'
import upload from '../utils/multer'

const router = express.Router()

router.post('/', upload.single('image'), addProduct)
router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.get('/:name', getProductByName)
router.get('/slug/:slug', getProductBySlug)
router.patch('/:id/featured', setFeatured)
router.put('/:id', upload.single('image'), updateProduct)
router.delete('/:id', deleteProduct)

export default router
