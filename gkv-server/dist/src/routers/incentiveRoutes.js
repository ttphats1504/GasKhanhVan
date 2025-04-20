"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const incentivesController_1 = require("../controllers/incentivesController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
router.post('/', upload.single('image'), incentivesController_1.addIncentive);
router.get('/', incentivesController_1.getAllIncentives);
router.get('/:id', incentivesController_1.getIncentiveById);
router.put('/:id', upload.single('image'), incentivesController_1.updateIncentive);
router.delete('/:id', incentivesController_1.deleteIncentive);
exports.default = router;
//# sourceMappingURL=incentiveRoutes.js.map