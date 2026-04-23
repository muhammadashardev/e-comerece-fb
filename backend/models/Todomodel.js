const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: [true, 'A task must have a title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
