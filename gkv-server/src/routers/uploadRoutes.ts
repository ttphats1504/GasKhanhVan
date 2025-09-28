// src/routes/uploadRoutes.ts
import express from 'express'
import {uploadImage} from '../controllers/uploadController'
import upload from '../utils/multer'

const router = express.Router()

router.post('/uploads', upload.single('file'), uploadImage)

export default router
