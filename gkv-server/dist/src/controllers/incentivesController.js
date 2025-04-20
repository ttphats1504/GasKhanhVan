"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIncentive = exports.updateIncentive = exports.getIncentiveById = exports.getAllIncentives = exports.addIncentive = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
const IncentiveModel_1 = __importDefault(require("../models/IncentiveModel"));
// Create
const addIncentive = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;
        let imageUrl = '';
        if (file) {
            const result = await cloudinary_1.default.uploader.upload(file.path, {
                folder: 'categories',
                use_filename: true,
            });
            imageUrl = result.secure_url;
            fs_1.default.unlinkSync(file.path);
        }
        const newIncentive = await IncentiveModel_1.default.create({
            name,
            image: imageUrl,
        });
        res.status(201).json(newIncentive);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addIncentive = addIncentive;
// Read All
const getAllIncentives = async (_req, res) => {
    try {
        const incentives = await IncentiveModel_1.default.findAll();
        res.status(200).json(incentives);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllIncentives = getAllIncentives;
// Read One
const getIncentiveById = async (req, res) => {
    try {
        const { id } = req.params;
        const incentive = await IncentiveModel_1.default.findByPk(id);
        if (!incentive) {
            res.status(404).json({ message: 'Incentive not found' });
            return;
        }
        res.status(200).json(incentive);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getIncentiveById = getIncentiveById;
// Update
const updateIncentive = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;
        const existing = await IncentiveModel_1.default.findByPk(id);
        if (!existing) {
            res.status(404).json({ message: 'Incentive not found' });
            return;
        }
        let imageUrl = existing.image;
        if (file) {
            const result = await cloudinary_1.default.uploader.upload(file.path, {
                folder: 'incentives',
                use_filename: true,
            });
            imageUrl = result.secure_url;
            fs_1.default.unlinkSync(file.path);
        }
        await existing.update(Object.assign(Object.assign({}, req.body), { image: imageUrl }));
        res.status(200).json(existing);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateIncentive = updateIncentive;
// Delete
const deleteIncentive = async (req, res) => {
    try {
        const { id } = req.params;
        await IncentiveModel_1.default.destroy({ where: { id } });
        res.status(200).json({ message: 'Incentive deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteIncentive = deleteIncentive;
//# sourceMappingURL=incentivesController.js.map