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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.addProduct = void 0;
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
// Create
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, typeId, price, stock, description } = req.body;
        const file = req.file;
        let imageUrl = '';
        if (file) {
            const result = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: 'products',
                use_filename: true,
            });
            imageUrl = result.secure_url;
            fs_1.default.unlinkSync(file.path);
        }
        const newProduct = yield ProductModel_1.default.create({
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
});
exports.addProduct = addProduct;
// Read All
const getAllProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield ProductModel_1.default.findAll();
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getAllProducts = getAllProducts;
// Read One
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield ProductModel_1.default.findByPk(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getProductById = getProductById;
// Update
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const file = req.file;
        const existing = yield ProductModel_1.default.findByPk(id);
        if (!existing) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        let imageUrl = existing.image;
        if (file) {
            const result = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: 'products',
                use_filename: true,
            });
            imageUrl = result.secure_url;
            fs_1.default.unlinkSync(file.path);
        }
        yield existing.update(Object.assign(Object.assign({}, req.body), { image: imageUrl }));
        res.status(200).json(existing);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateProduct = updateProduct;
// Delete
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield ProductModel_1.default.destroy({ where: { id } });
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productsController.js.map