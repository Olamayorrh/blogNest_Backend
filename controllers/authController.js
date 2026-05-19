const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    console.log('--- Signup Attempt ---');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    const userExists = await User.findOne({ email });

    if (userExists) {
        console.log(`--- Signup Failed: User already exists (${email}) ---`);
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        username,
        email,
        password,
        role: role || 'blogger',
    });

    if (user) {
        console.log(`--- Signup Success: User created (${email}) ---`);
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            themePreference: user.themePreference,
            token: generateToken(user._id),
        });
    } else {
        console.log(`--- Signup Failed: Invalid user data ---`);
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log('--- Login Attempt ---');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (user.isBlocked) {
            console.log(`--- Login Failed: User is blocked (${email}) ---`);
            res.status(403);
            throw new Error('User is blocked. Please contact admin.');
        }
        console.log(`--- Login Success: User logged in (${email}) ---`);
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            themePreference: user.themePreference,
            token: generateToken(user._id),
        });
    } else {
        console.log(`--- Login Failed: Invalid email or password (${email}) ---`);
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

module.exports = { registerUser, loginUser };
