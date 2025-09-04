"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogBySlug = exports.getBlogById = exports.getAllBlogs = exports.addBlog = void 0;
const BlogModel_1 = __importDefault(require("../models/BlogModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const slugify_1 = require("../utils/slugify");
const sequelize_1 = require("sequelize");
// Create blog
const addBlog = async (req, res) => {
    try {
        const { title, content, author, published } = req.body;
        const file = req.file;
        let thumbnailUrl = '';
        const slug = (0, slugify_1.slugify)(title);
        if (file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: 'blogs', use_filename: true }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
            });
            thumbnailUrl = result.secure_url;
        }
        const newBlog = await BlogModel_1.default.create({
            title,
            content,
            slug,
            author,
            published: published !== null && published !== void 0 ? published : false,
            thumbnail: thumbnailUrl,
        });
        res.status(201).json(newBlog);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addBlog = addBlog;
// Get all blogs (with pagination + search + filter published)
const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { search, published } = req.query;
        const whereClause = {};
        if (search) {
            whereClause[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.like]: `%${search}%` } },
                { content: { [sequelize_1.Op.like]: `%${search}%` } },
            ];
        }
        if (published !== undefined) {
            whereClause.published = published === 'true';
        }
        const [totalItems, blogs] = await Promise.all([
            BlogModel_1.default.count({ where: whereClause }),
            BlogModel_1.default.findAll({
                where: whereClause,
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            }),
        ]);
        res.status(200).json({
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            data: blogs,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllBlogs = getAllBlogs;
// Get blog by ID
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await BlogModel_1.default.findByPk(id);
        if (!blog) {
            res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getBlogById = getBlogById;
// Get blog by slug
const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await BlogModel_1.default.findOne({ where: { slug } });
        if (!blog) {
            res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getBlogBySlug = getBlogBySlug;
// Update blog
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, published } = req.body;
        const slug = title ? (0, slugify_1.slugify)(title) : undefined;
        const existing = await BlogModel_1.default.findByPk(id);
        if (!existing) {
            res.status(404).json({ message: 'Blog not found' });
        }
        else {
            let thumbnailUrl = existing.thumbnail;
            const file = req.file;
            if (file) {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: 'blogs', use_filename: true }, (error, result) => {
                        if (error)
                            return reject(error);
                        resolve(result);
                    });
                    streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
                });
                thumbnailUrl = result.secure_url;
                await existing.update(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), { thumbnail: thumbnailUrl }), (slug && { slug })), { published: published !== null && published !== void 0 ? published : existing.published }));
            }
        }
        res.json(existing);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateBlog = updateBlog;
// Delete blog
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        await BlogModel_1.default.destroy({ where: { id } });
        res.json({ message: 'Blog deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteBlog = deleteBlog;
//# sourceMappingURL=blogsController.js.map