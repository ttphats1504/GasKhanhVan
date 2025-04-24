"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const incentivesController_1 = require("../controllers/incentivesController");
const multer_1 = __importDefault(require("../utils/multer"));
const router = express_1.default.Router();
router.post('/', multer_1.default.single('image'), incentivesController_1.addIncentive);
router.get('/', incentivesController_1.getAllIncentives);
router.get('/:id', incentivesController_1.getIncentiveById);
router.put('/:id', multer_1.default.single('image'), incentivesController_1.updateIncentive);
router.delete('/:id', incentivesController_1.deleteIncentive);
exports.default = router;
//# sourceMappingURL=incentiveRoutes.js.map