"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const productsController_1 = require("../controllers/productsController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
router.post('/', upload.single('image'), productsController_1.addProduct);
router.get('/', productsController_1.getAllProducts);
router.get('/:id', productsController_1.getProductById);
router.put('/:id', upload.single('image'), productsController_1.updateProduct);
router.delete('/:id', productsController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map