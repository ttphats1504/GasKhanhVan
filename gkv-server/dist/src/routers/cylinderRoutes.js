"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cylinderController_1 = require("../controllers/cylinderController");
const multer_1 = __importDefault(require("../utils/multer"));
const router = (0, express_1.Router)();
// Cylinder routes
router.post('/', multer_1.default.single('image'), cylinderController_1.addCylinder);
router.get('/', cylinderController_1.getAllCylinders);
router.get('/:id', cylinderController_1.getCylinderById);
router.put('/:id', multer_1.default.single('image'), cylinderController_1.updateCylinder);
router.delete('/:id', cylinderController_1.deleteCylinder);
exports.default = router;
//# sourceMappingURL=cylinderRoutes.js.map