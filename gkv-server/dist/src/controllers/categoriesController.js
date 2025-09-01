"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryBySlug = exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.addCategory = void 0;
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
// Create
const addCategory = async (req, res) => {
    try {
        const { name, slug, parentId } = req.body;
        const file = req.file;
        let imageUrl = '';
        if (file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    folder: 'categories',
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
        const newCategory = await CategoryModel_1.default.create({
            name,
            image: imageUrl,
            slug,
            parentId: parentId || null,
        });
        res.status(201).json(newCategory);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addCategory = addCategory;
// Read All
const getAllCategories = async (_req, res) => {
    try {
        const categories = await CategoryModel_1.default.findAll({
            where: { parentId: null }, // only root
            include: [
                {
                    model: CategoryModel_1.default,
                    as: 'children',
                    include: [
                        { model: CategoryModel_1.default, as: 'children' }, // 👈 allows 2-level nesting
                    ],
                },
            ],
        });
        res.status(200).json(categories);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllCategories = getAllCategories;
// Read One
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel_1.default.findByPk(id, {
            include: [
                {
                    model: CategoryModel_1.default,
                    as: 'children',
                    include: [
                        {
                            model: CategoryModel_1.default,
                            as: 'children', // nested children (grandchildren)
                        },
                    ],
                },
            ],
        });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.status(200).json(category);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCategoryById = getCategoryById;
// Update
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;
        const existing = await CategoryModel_1.default.findByPk(id);
        if (!existing) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        let imageUrl = existing.image;
        if (file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    folder: 'categories',
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
        await existing.update(Object.assign(Object.assign({}, req.body), { image: imageUrl }));
        res.status(200).json(existing);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateCategory = updateCategory;
// Delete
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await CategoryModel_1.default.destroy({ where: { id } });
        res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteCategory = deleteCategory;
// Read by Slug
const getCategoryBySlug = async (req, res) => {
    try {
        let { slug } = req.params;
        // Handle cases where slug is nested: "parent/child"
        const slugParts = slug.split('/');
        let category;
        if (slugParts.length === 1) {
            // simple slug
            category = await CategoryModel_1.default.findOne({
                where: { slug: slugParts[0] },
                include: [
                    {
                        model: CategoryModel_1.default,
                        as: 'children',
                        include: [{ model: CategoryModel_1.default, as: 'children' }],
                    },
                ],
            });
        }
        else {
            // nested slug: resolve last slug only
            const lastSlug = slugParts[slugParts.length - 1];
            category = await CategoryModel_1.default.findOne({
                where: { slug: lastSlug },
                include: [
                    {
                        model: CategoryModel_1.default,
                        as: 'children',
                        include: [{ model: CategoryModel_1.default, as: 'children' }],
                    },
                ],
            });
        }
        // if (!category) {
        //   res.status(404).json({message: 'Category not found'})
        // }
        res.status(200).json(category);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
//# sourceMappingURL=categoriesController.js.map