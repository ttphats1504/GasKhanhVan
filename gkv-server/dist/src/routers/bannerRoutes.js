"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bannersController_1 = require("../controllers/bannersController");
const multer_1 = __importDefault(require("../utils/multer"));
const router = express_1.default.Router();
router.post('/', multer_1.default.single('image'), bannersController_1.addBanner);
router.get('/', bannersController_1.getAllBanners);
router.get('/:id', bannersController_1.getBannerById);
router.put('/:id', multer_1.default.single('image'), bannersController_1.updateBanner);
router.delete('/:id', bannersController_1.deleteBanner);
exports.default = router;
//# sourceMappingURL=bannerRoutes.js.map