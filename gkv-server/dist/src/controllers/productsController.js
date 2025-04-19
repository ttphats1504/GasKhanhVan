"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.addProduct = void 0;
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
// Create
const addProduct = async (req, res) => {
    try {
        const { name, typeId, price, stock, description } = req.body;
        const file = req.file;
        let imageUrl = '';
        if (file) {
            const result = await cloudinary_1.default.uploader.upload(file.path, {
                folder: 'products',
                use_filename: true,
            });
            imageUrl = result.secure_url;
            fs_1.default.unlinkSync(file.path);
        }
        const newProduct = await ProductModel_1.default.create({
            name,
            typeId,
            price,
            stock,
            description,
            image: imageUrl,
        });
        res.status(201).json(newProduct);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addProduct = addProduct;
// Read All
const getAllProducts = async (_req, res) => {
    try {
        const products = await ProductModel_1.default.findAll();
        res.status(200).json(products);
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
// Update
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;
        const existing = await ProductModel_1.default.findByPk(id);
        if (!existing) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        let imageUrl = existing.image;
        if (file) {
            const result = await cloudinary_1.default.uploader.upload(file.path, {
                folder: 'products',
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