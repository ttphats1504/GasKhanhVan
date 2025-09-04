"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/brandsRoutes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const brandsController_1 = require("../controllers/brandsController");
const upload = (0, multer_1.default)(); // use memory storage to forward to cloudinary
const router = (0, express_1.Router)();
router.get('/', brandsController_1.getBrands);
router.post('/', upload.single('image'), brandsController_1.addBrand);
router.get('/:id', brandsController_1.getBrandById);
router.put('/:id', upload.single('image'), brandsController_1.updateBrand);
router.delete('/:id', brandsController_1.deleteBrand);
router.patch('/reorder', brandsController_1.reorderBrands);
exports.default = router;
//# sourceMappingURL=brandsRoutes.js.map