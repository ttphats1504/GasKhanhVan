"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCylinder = exports.updateCylinder = exports.getCylinderById = exports.getAllCylinders = exports.addCylinder = void 0;
const CylinderModel_1 = __importDefault(require("../models/CylinderModel"));
// Add a new cylinder with image
const addCylinder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Raw body:', req.body);
        const { name, type, price, stock, description } = req.body;
        const image = req.file ? req.file.path : ''; // Path to the uploaded image
        const newCylinder = new CylinderModel_1.default({
            name,
            type,
            price,
            stock,
            image,
            description, // Rich text description
        });
        yield newCylinder.save();
        res.status(201).json(newCylinder);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.addCylinder = addCylinder;
// Get all cylinders
const getAllCylinders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cylinders = yield CylinderModel_1.default.find();
        res.status(200).json(cylinders);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getAllCylinders = getAllCylinders;
// Get a single cylinder by ID
const getCylinderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const cylinder = yield CylinderModel_1.default.findById(id);
        if (!cylinder) {
            res.status(404).json({ message: 'Cylinder not found' });
            return;
        }
        res.status(200).json(cylinder);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getCylinderById = getCylinderById;
// Update a cylinder
const updateCylinder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedCylinder = yield CylinderModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedCylinder);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateCylinder = updateCylinder;
// Delete a cylinder
const deleteCylinder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield CylinderModel_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Cylinder deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteCylinder = deleteCylinder;
//# sourceMappingURL=cylinderController.js.map