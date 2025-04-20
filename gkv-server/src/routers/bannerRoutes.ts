import express from 'express'
import multer from 'multer'
import {
  addBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from '../controllers/bannersController'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({storage})

router.post('/', upload.single('image'), addBanner)
router.get('/', getAllBanners)
router.get('/:id', getBannerById)
router.put('/:id', upload.single('image'), updateBanner)
router.delete('/:id', deleteBanner)

export default router
