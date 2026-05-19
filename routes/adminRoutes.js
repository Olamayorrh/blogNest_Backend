const express = require('express');
const router = express.Router();
const {
    getUsers,
    deleteUser,
    toggleBlockUser,
    getAllPostsAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.use(protect, admin);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/block', toggleBlockUser);
router.get('/posts', getAllPostsAdmin);

module.exports = router;
