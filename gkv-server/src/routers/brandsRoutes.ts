// src/routes/brandsRoutes.ts
import {Router} from 'express'
import multer from 'multer'
import {
  addBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  reorderBrands,
} from '../controllers/brandsController'

const upload = multer() // use memory storage to forward to cloudinary
const router = Router()

router.get('/', getBrands)
router.post('/', upload.single('image'), addBrand)
router.get('/:id', getBrandById)
router.put('/:id', upload.single('image'), updateBrand)
router.delete('/:id', deleteBrand)
router.patch('/reorder', reorderBrands)

export default router
