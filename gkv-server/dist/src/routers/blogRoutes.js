"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../utils/multer"));
const blogsController_1 = require("../controllers/blogsController");
const router = express_1.default.Router();
// Create
router.post('/', multer_1.default.single('thumbnail'), blogsController_1.addBlog);
// Read
router.get('/', blogsController_1.getAllBlogs); // ?page=1&limit=10&search=seo&published=true
router.get('/:id', blogsController_1.getBlogById);
router.get('/slug/:slug', blogsController_1.getBlogBySlug);
// Update
router.put('/:id', multer_1.default.single('thumbnail'), blogsController_1.updateBlog);
// Delete
router.delete('/:id', blogsController_1.deleteBlog);
exports.default = router;
//# sourceMappingURL=blogRoutes.js.map