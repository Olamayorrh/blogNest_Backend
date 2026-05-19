const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');

const isOwnerOrAdmin = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Check if user is owner or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to perform this action');
    }

    req.post = post; // Pass the post to the controller to avoid redundant DB call
    next();
});

module.exports = { isOwnerOrAdmin };
