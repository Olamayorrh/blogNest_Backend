const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getCategories)
    .post(protect, admin, createCategory);

module.exports = router;
