"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCylinder = exports.updateCylinder = exports.getCylinderById = exports.getAllCylinders = exports.addCylinder = void 0;
const CylinderModel_1 = __importDefault(require("../models/CylinderModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
// Add a new cylinder with image
const addCylinder = async (req, res) => {
    try {
        const { name, type, price, stock, description } = req.body;
        const file = req === null || req === void 0 ? void 0 : req.file;
        const image = req.file ? req.file.path : ''; // Path to the uploaded image
        const newCylinder = new CylinderModel_1.default({
            name,
            type,
            price,
            stock,
            image,
            description, // Rich text description
        });
        await newCylinder.save();
        // Step 2: Upload Image to Cloudinary
        let imageUrl = '';
        if (file) {
            const result = await cloudinary_1.default.uploader.upload(file.path, {
                folder: 'cylinders', // Save images inside a "cylinders" folder
                use_filename: true,
            });
            imageUrl = result.secure_url; // Get public Cloudinary URL
            // Step 3: Update Cylinder with Image URL
            newCylinder.image = imageUrl;
            await newCylinder.save();
            // Delete local file after upload
            fs_1.default.unlinkSync(file.path);
        }
        res.status(201).json(newCylinder);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addCylinder = addCylinder;
// Get all cylinders
const getAllCylinders = async (req, res) => {
    try {
        const cylinders = await CylinderModel_1.default.find();
        res.status(200).json(cylinders);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllCylinders = getAllCylinders;
// Get a single cylinder by ID
const getCylinderById = async (req, res) => {
    try {
        const { id } = req.params;
        const cylinder = await CylinderModel_1.default.findById(id);
        if (!cylinder) {
            res.status(404).json({ message: 'Cylinder not found' });
            return;
        }
        res.status(200).json(cylinder);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCylinderById = getCylinderById;
// Update a cylinder
const updateCylinder = async (req, res) => {
    var _a;
    try {
        console.log('🔍 Request Params:', req.params);
        console.log('📝 Request Body:', req.body);
        const { id } = req.params;
        const file = req.file; // Get uploaded file (if any)
        // Find the existing cylinder
        const existingCylinder = await CylinderModel_1.default.findById(id);
        if (existingCylinder) {
            let imageUrl = existingCylinder.image; // Keep old image if no new one is uploaded
            if (file) {
                console.log('📸 New Image File:', file.originalname);
                // ✅ Upload new image to Cloudinary
                const uploadResult = await cloudinary_1.default.uploader.upload(file.path, {
                    folder: 'cylinders', // Store in "cylinders" folder
                    use_filename: true,
                });
                imageUrl = uploadResult.secure_url; // Get Cloudinary URL
                // ✅ Delete old image from Cloudinary (if exists)
                if (existingCylinder.image) {
                    const oldImagePublicId = (_a = existingCylinder.image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0]; // Extract public ID
                    if (oldImagePublicId) {
                        await cloudinary_1.default.uploader.destroy(`cylinders/${oldImagePublicId}`);
                    }
                }
                // ✅ Delete local file
                fs_1.default.unlinkSync(file.path);
            }
            // ✅ Update cylinder in the database
            const updatedCylinder = await CylinderModel_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { image: imageUrl }), // Update all fields + new image URL
            { new: true, runValidators: true } // Return updated document
            );
            console.log('✅ Updated Cylinder:', updatedCylinder);
            res.status(200).json(updatedCylinder);
        }
    }
    catch (err) {
        console.error('❌ Error updating cylinder:', err);
        res.status(500).json({ error: err.message });
    }
};
exports.updateCylinder = updateCylinder;
// Delete a cylinder
const deleteCylinder = async (req, res) => {
    try {
        const { id } = req.params;
        await CylinderModel_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Cylinder deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteCylinder = deleteCylinder;
//# sourceMappingURL=cylinderController.js.map