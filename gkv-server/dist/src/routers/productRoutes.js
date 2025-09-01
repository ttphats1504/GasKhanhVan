"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsController_1 = require("../controllers/productsController");
const multer_1 = __importDefault(require("../utils/multer"));
const router = express_1.default.Router();
router.post('/', multer_1.default.single('image'), productsController_1.addProduct);
router.get('/', productsController_1.getAllProducts);
router.get('/:id', productsController_1.getProductById);
router.get('/:name', productsController_1.getProductByName);
router.get('/slug/:slug', productsController_1.getProductBySlug);
router.put('/:id', multer_1.default.single('image'), productsController_1.updateProduct);
router.delete('/:id', productsController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map