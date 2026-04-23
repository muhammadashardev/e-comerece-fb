const Todo = require('../models/Todomodel');

// 1) Get all tasks
exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            results: todos.length,
            data: { todos }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 2) Create a task
exports.createTodo = async (req, res) => {
    try {
        const newTodo = await Todo.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { todo: newTodo }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 3) Update a task
exports.updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!todo) {
            return res.status(404).json({ status: 'fail', message: 'No task found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: { todo }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 4) Delete a task
exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({ status: 'fail', message: 'No task found with that ID' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
