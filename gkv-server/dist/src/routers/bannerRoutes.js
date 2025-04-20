"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const bannersController_1 = require("../controllers/bannersController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
router.post('/', upload.single('image'), bannersController_1.addBanner);
router.get('/', bannersController_1.getAllBanners);
router.get('/:id', bannersController_1.getBannerById);
router.put('/:id', upload.single('image'), bannersController_1.updateBanner);
router.delete('/:id', bannersController_1.deleteBanner);
exports.default = router;
//# sourceMappingURL=bannerRoutes.js.map