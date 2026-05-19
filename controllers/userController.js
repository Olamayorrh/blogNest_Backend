const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.bio = req.body.bio || user.bio;
        
        if (req.file) {
            user.profilePic = req.file.path;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            bio: updatedUser.bio,
            profilePic: updatedUser.profilePic,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete own account
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user theme preference
// @route   PUT /api/users/theme
// @access  Private
const updateThemePreference = asyncHandler(async (req, res) => {
    const { themePreference } = req.body;

    if (!['light', 'dark'].includes(themePreference)) {
        res.status(400);
        throw new Error('Invalid theme. Must be "light" or "dark"');
    }

    const user = await User.findById(req.user._id);

    if (user) {
        user.themePreference = themePreference;
        await user.save();
        console.log(`--- Theme updated: ${user.email} switched to ${themePreference} mode ---`);
        res.json({ themePreference: user.themePreference });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { updateUserProfile, deleteUserProfile, updateThemePreference };
