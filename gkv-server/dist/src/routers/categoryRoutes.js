"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const categoriesController_1 = require("../controllers/categoriesController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
router.post('/', upload.single('image'), categoriesController_1.addCategory);
router.get('/', categoriesController_1.getAllCategories);
router.get('/:id', categoriesController_1.getCategoryById);
router.put('/:id', upload.single('image'), categoriesController_1.updateCategory);
router.delete('/:id', categoriesController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map