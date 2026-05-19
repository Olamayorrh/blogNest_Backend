const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { blogger } = require('../middleware/roleMiddleware');
const { isOwnerOrAdmin } = require('../middleware/ownershipMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getPosts)
    .post(protect, blogger, upload.single('thumbnail'), createPost);

router.get('/my-posts', protect, blogger, getMyPosts);

router.route('/:id')
    .get(getPostById)
    .put(protect, blogger, isOwnerOrAdmin, upload.single('thumbnail'), updatePost)
    .delete(protect, isOwnerOrAdmin, deletePost);

module.exports = router;
