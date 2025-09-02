"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.setFeatured = exports.getProductBySlug = exports.getProductByName = exports.getProductById = exports.getAllProducts = exports.addProduct = void 0;
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const slugify_1 = require("../utils/slugify");
const sequelize_1 = require("sequelize");
// Create
const addProduct = async (req, res) => {
    try {
        const { name, typeId, price, stock, description, description2 } = req.body;
        const file = req.file;
        let imageUrl = '';
        const slug = (0, slugify_1.slugify)(name);
        if (file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    folder: 'products',
                    use_filename: true,
                }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
            });
            imageUrl = result.secure_url;
        }
        const newProduct = await ProductModel_1.default.create({
            name,
            typeId,
            price,
            stock,
            description,
            image: imageUrl,
            slug,
            description2,
            isFeatured: 0,
        });
        res.status(201).json(newProduct);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addProduct = addProduct;
// Read All
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { typeId, search, featured } = req.query;
        const whereClause = {};
        if (typeId) {
            whereClause.typeId = typeId; // lọc theo typeId
        }
        if (search) {
            whereClause[sequelize_1.Op.or] = [{ name: { [sequelize_1.Op.like]: `%${search}%` } }];
        }
        if (featured === 'true') {
            whereClause.isFeatured = 1; // tinyint
        }
        const [totalItems, products] = await Promise.all([
            ProductModel_1.default.count({ where: whereClause }),
            ProductModel_1.default.findAll({
                where: whereClause,
                limit,
                offset,
                order: [['createdAt', 'DESC']], // optional: sắp xếp mới nhất
            }),
        ]);
        res.status(200).json({
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            data: products,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllProducts = getAllProducts;
// Read One
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel_1.default.findByPk(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProductById = getProductById;
// Read One by Name
const getProductByName = async (req, res) => {
    try {
        const { name } = req.params;
        const product = await ProductModel_1.default.findOne({
            where: { name },
        });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProductByName = getProductByName;
const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await ProductModel_1.default.findOne({ where: { slug } });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProductBySlug = getProductBySlug;
// controllers/productsController.ts
const setFeatured = async (req, res) => {
    try {
        const { id } = req.params;
        const { isFeatured } = req.body;
        const product = await ProductModel_1.default.findByPk(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        }
        else {
            console.log(isFeatured);
            product.isFeatured = isFeatured ? 1 : 0;
            await product.save();
        }
        res.json({ message: 'Updated featured status', product });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.setFeatured = setFeatured;
// Update
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const slug = name ? (0, slugify_1.slugify)(name) : undefined;
        const file = req.file;
        const existing = await ProductModel_1.default.findByPk(id);
        if (!existing) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        let imageUrl = existing.image;
        if (file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    folder: 'products',
                    use_filename: true,
                }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
            });
            imageUrl = result.secure_url;
        }
        await existing.update(Object.assign(Object.assign(Object.assign({}, req.body), { image: imageUrl }), (slug && { slug })));
        res.status(200).json(existing);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateProduct = updateProduct;
// Delete
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await ProductModel_1.default.destroy({ where: { id } });
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productsController.js.map