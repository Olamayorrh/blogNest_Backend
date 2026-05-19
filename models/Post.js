const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
        },
        subtitle: {
            type: String,
            default: '',
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Please add content'],
        },
        thumbnail: {
            type: String,
            default: '',
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Please add a category'],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Post', postSchema);
