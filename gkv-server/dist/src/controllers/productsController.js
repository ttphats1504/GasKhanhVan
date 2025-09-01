"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductBySlug = exports.getProductByName = exports.getProductById = exports.getAllProducts = exports.addProduct = void 0;
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const slugify_1 = require("../utils/slugify");
// Create
const addProduct = async (req, res) => {
    try {
        const { name, typeId, price, stock, description } = req.body;
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
        const { categoryId } = req.query;
        const whereClause = {};
        if (categoryId) {
            whereClause.typeId = categoryId;
        }
        const [totalItems, products] = await Promise.all([
            ProductModel_1.default.count({ where: whereClause }), // Count with filter applied
            ProductModel_1.default.findAll({
                where: whereClause, // Apply the filter here as well
                limit,
                offset,
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
        res.json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProductBySlug = getProductBySlug;
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