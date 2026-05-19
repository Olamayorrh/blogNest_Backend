const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isBlocked = !user.isBlocked;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all posts (Admin view)
// @route   GET /api/admin/posts
// @access  Private/Admin
const getAllPostsAdmin = asyncHandler(async (req, res) => {
    const posts = await Post.find({})
        .populate('author', 'username email')
        .populate('category', 'name');
    res.json(posts);
});

module.exports = {
    getUsers,
    deleteUser,
    toggleBlockUser,
    getAllPostsAdmin,
};
