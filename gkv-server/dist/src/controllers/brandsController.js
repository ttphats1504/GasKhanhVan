"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderBrands = exports.deleteBrand = exports.updateBrand = exports.getBrandById = exports.getBrands = exports.addBrand = void 0;
const BrandModel_1 = __importDefault(require("../models/BrandModel"));
const slugify_1 = require("../utils/slugify");
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// create brand
const addBrand = async (req, res) => {
    try {
        const { name, order } = req.body;
        const file = req.file;
        let imageUrl = null;
        const slug = (0, slugify_1.slugify)(name);
        if (file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: 'brands', use_filename: true }, (err, result) => {
                    if (err)
                        return reject(err);
                    resolve(result);
                });
                streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
            });
            imageUrl = result.secure_url;
        }
        const brand = await BrandModel_1.default.create({
            name,
            image: imageUrl,
            slug,
            order: order ? parseInt(order) : 0,
        });
        res.status(201).json(brand);
    }
    catch (err) {
        console.error('❌ Add Brand Error:', err);
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: err.message, details: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
};
exports.addBrand = addBrand;
// get all (with pagination & search)
const getBrands = async (req, res) => {
    try {
        const page = parseInt(req.query.page || '1');
        const limit = parseInt(req.query.limit || '20');
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const where = {};
        if (search) {
            where.name = { $like: `%${search}%` }; // for sequelize v5 maybe Op.like; adjust based on your setup
        }
        // prefer Op import if using modern Sequelize:
        // import { Op } from 'sequelize' and use Op.like
        const { count, rows } = await BrandModel_1.default.findAndCountAll({
            where,
            limit,
            offset,
            order: [
                ['order', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        });
        res.json({ page, limit, totalItems: count, data: rows });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getBrands = getBrands;
// get by id
const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await BrandModel_1.default.findByPk(id);
        if (!brand) {
            res.status(404).json({ message: 'Brand not found' });
        }
        res.json(brand);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getBrandById = getBrandById;
// update
const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, order } = req.body;
        const file = req.file;
        const brand = await BrandModel_1.default.findByPk(id);
        if (!brand) {
            res.status(404).json({ message: 'Brand not found' });
        }
        else {
            let imageUrl = brand.image;
            if (file) {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: 'brands', use_filename: true }, (err, result) => {
                        if (err)
                            return reject(err);
                        resolve(result);
                    });
                    streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
                });
                imageUrl = result.secure_url;
            }
            // update slug if name changed
            let slug = brand.slug;
            if (name && name !== brand.name) {
                const base = (0, slugify_1.slugify)(name);
                let candidate = base;
                let counter = 1;
                while (await BrandModel_1.default.findOne({ where: { slug: candidate, id: { $ne: brand.id } } })) {
                    candidate = `${base}-${counter++}`;
                }
                slug = candidate;
            }
            await brand.update({
                name: name !== null && name !== void 0 ? name : brand.name,
                image: imageUrl,
                slug,
                order: order !== undefined ? parseInt(order) : brand.order,
            });
        }
        res.json(brand);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateBrand = updateBrand;
// delete
const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        await BrandModel_1.default.destroy({ where: { id } });
        res.json({ message: 'Brand deleted' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteBrand = deleteBrand;
// set order bulk (accepts [{id, order}, ...])
const reorderBrands = async (req, res) => {
    try {
        const updates = req.body;
        if (!Array.isArray(updates)) {
            res.status(400).json({ message: 'Invalid payload' });
        }
        await Promise.all(updates.map((u) => BrandModel_1.default.update({ order: u.order }, { where: { id: u.id } })));
        res.json({ message: 'Order updated' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.reorderBrands = reorderBrands;
//# sourceMappingURL=brandsController.js.map