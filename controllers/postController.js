const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const Category = require('../models/Category');

// @desc    Create a new post
// @route   POST /api/posts  OR  POST /api/blogs
// @access  Private/Blogger
const createPost = asyncHandler(async (req, res) => {
    const { title, subtitle, description, content, category, isPublished } = req.body;

    // Accept 'description' (from frontend) or 'content' as the blog body
    const blogContent = description || content;

    if (!title || !blogContent) {
        res.status(400);
        throw new Error('Title and content are required');
    }

    // Resolve category: frontend sends a string name, DB uses ObjectId
    let categoryId = category;
    if (category && !category.match(/^[0-9a-fA-F]{24}$/)) {
        // It's a string name, not an ObjectId — find or create the category
        let categoryDoc = await Category.findOne({
            name: { $regex: new RegExp(`^${category}$`, 'i') },
        });
        if (!categoryDoc) {
            categoryDoc = await Category.create({ name: category.charAt(0).toUpperCase() + category.slice(1) });
        }
        categoryId = categoryDoc._id;
    }

    // Handle thumbnail file upload
    let thumbnailPath = '';
    if (req.file) {
        thumbnailPath = `uploads/${req.file.filename}`;
    }

    const post = new Post({
        title,
        subtitle: subtitle || '',
        content: blogContent,
        thumbnail: thumbnailPath,
        isPublished: isPublished === 'true' || isPublished === true,
        category: categoryId,
        author: req.user._id,
    });

    const createdPost = await post.save();

    // Populate author and category before returning
    const populatedPost = await Post.findById(createdPost._id)
        .populate('author', 'username email profilePic')
        .populate('category', 'name');

    res.status(201).json(populatedPost);
});

// @desc    Get all posts (publicly viewable)
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ isPublished: true })
        .populate('author', 'username email profilePic')
        .populate('category', 'name')
        .sort({ createdAt: -1 });
    res.json(posts);
});

// @desc    Get own posts
// @route   GET /api/posts/my-posts
// @access  Private/Blogger
const getMyPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ author: req.user._id })
        .populate('category', 'name')
        .sort({ createdAt: -1 });
    res.json(posts);
});

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'username email profilePic')
        .populate('category', 'name');

    if (post) {
        res.json(post);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private/Blogger/Owner
const updatePost = asyncHandler(async (req, res) => {
    const { title, subtitle, description, content, category, isPublished } = req.body;

    // req.post is attached by ownershipMiddleware
    const post = req.post;

    if (post) {
        post.title = title || post.title;
        post.subtitle = subtitle !== undefined ? subtitle : post.subtitle;
        post.content = description || content || post.content;
        post.isPublished = isPublished !== undefined
            ? (isPublished === 'true' || isPublished === true)
            : post.isPublished;

        // Handle category update
        if (category) {
            if (!category.match(/^[0-9a-fA-F]{24}$/)) {
                let categoryDoc = await Category.findOne({
                    name: { $regex: new RegExp(`^${category}$`, 'i') },
                });
                if (!categoryDoc) {
                    categoryDoc = await Category.create({ name: category.charAt(0).toUpperCase() + category.slice(1) });
                }
                post.category = categoryDoc._id;
            } else {
                post.category = category;
            }
        }

        // Handle thumbnail update
        if (req.file) {
            post.thumbnail = `uploads/${req.file.filename}`;
        }

        const updatedPost = await post.save();
        const populatedPost = await Post.findById(updatedPost._id)
            .populate('author', 'username email profilePic')
            .populate('category', 'name');
        res.json(populatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private/Blogger/Owner/Admin
const deletePost = asyncHandler(async (req, res) => {
    const post = req.post;

    if (post) {
        await Post.deleteOne({ _id: post._id });
        res.json({ message: 'Post removed' });
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

module.exports = {
    createPost,
    getPosts,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost,
};
