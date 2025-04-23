import express from 'express'
import {
  addBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from '../controllers/bannersController'
import upload from '../utils/multer'

const router = express.Router()

router.post('/', upload.single('image'), addBanner)
router.get('/', getAllBanners)
router.get('/:id', getBannerById)
router.put('/:id', upload.single('image'), updateBanner)
router.delete('/:id', deleteBanner)

export default router
