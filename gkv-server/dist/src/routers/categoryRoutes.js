"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoriesController_1 = require("../controllers/categoriesController");
const multer_1 = __importDefault(require("../utils/multer"));
const router = express_1.default.Router();
router.post('/', multer_1.default.single('image'), categoriesController_1.addCategory);
router.get('/', categoriesController_1.getAllCategories);
router.get('/:id', categoriesController_1.getCategoryById);
router.get('/slug/:slug', categoriesController_1.getCategoryBySlug);
router.put('/:id', multer_1.default.single('image'), categoriesController_1.updateCategory);
router.delete('/:id', categoriesController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map