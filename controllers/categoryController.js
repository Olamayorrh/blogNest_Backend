const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

module.exports = { createCategory, getCategories };
