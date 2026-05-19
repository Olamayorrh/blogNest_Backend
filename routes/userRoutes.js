const express = require('express');
const router = express.Router();
const {
    updateUserProfile,
    deleteUserProfile,
    updateThemePreference,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
    .route('/profile')
    .put(protect, upload.single('profilePic'), updateUserProfile)
    .delete(protect, deleteUserProfile);

router.put('/theme', protect, updateThemePreference);

module.exports = router;
