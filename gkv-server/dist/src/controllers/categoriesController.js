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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.addCategory = void 0;
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
// Create
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug } = req.body;
        const file = req.file;
        let imageUrl = '';
        if (file) {
            const result = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: 'categories',
                use_filename: true,
            });
            imageUrl = result.secure_url;
            fs_1.default.unlinkSync(file.path);
        }
        const newCategory = yield CategoryModel_1.default.create({
            name,
            image: imageUrl,
            slug: slug,
        });
        res.status(201).json(newCategory);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.addCategory = addCategory;
// Read All
const getAllCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield CategoryModel_1.default.findAll();
        res.status(200).json(categories);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getAllCategories = getAllCategories;
// Read One
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield CategoryModel_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.status(200).json(category);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getCategoryById = getCategoryById;
// Update
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const file = req.file;
        const existing = yield CategoryModel_1.default.findByPk(id);
        if (!existing) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        let imageUrl = existing.image;
        if (file) {
            const result = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: 'categories',
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
exports.updateCategory = updateCategory;
// Delete
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield CategoryModel_1.default.destroy({ where: { id } });
        res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoriesController.js.map