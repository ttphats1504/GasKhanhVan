"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.getBannerById = exports.getAllBanners = exports.addBanner = void 0;
const BannerModel_1 = __importDefault(require("../models/BannerModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
// Create
const addBanner = async (req, res) => {
    try {
        const file = req.file;
        let imageUrl = '';
        if (file) {
            const result = await cloudinary_1.default.uploader.upload(file.path, {
                folder: 'banners',
                use_filename: true,
            });
            imageUrl = result.secure_url;
            fs_1.default.unlinkSync(file.path);
        }
        const newBanner = await BannerModel_1.default.create({
            image: imageUrl,
        });
        res.status(201).json(newBanner);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addBanner = addBanner;
// Read All
const getAllBanners = async (_req, res) => {
    try {
        const banners = await BannerModel_1.default.findAll();
        res.status(200).json(banners);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllBanners = getAllBanners;
// Read One
const getBannerById = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await BannerModel_1.default.findByPk(id);
        if (!banner) {
            res.status(404).json({ message: 'Banner not found' });
            return;
        }
        res.status(200).json(banner);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getBannerById = getBannerById;
// Update
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;
        const existing = await BannerModel_1.default.findByPk(id);
        if (!existing) {
            res.status(404).json({ message: 'Banner not found' });
            return;
        }
        let imageUrl = existing.image;
        if (file) {
            const result = await cloudinary_1.default.uploader.upload(file.path, {
                folder: 'banners',
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
exports.updateBanner = updateBanner;
// Delete
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await BannerModel_1.default.destroy({ where: { id } });
        res.status(200).json({ message: 'Banner deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteBanner = deleteBanner;
//# sourceMappingURL=bannersController.js.map