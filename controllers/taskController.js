import asyncHandler from '../middleware/asyncHandler.js';
import Task from '../models/Task.js';

// @desc    Create a task
// @route   POST /task/create
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, status = 'TODO' } = req.body;
    await Task.create({ user: req.user._id, title, description, status });
    res
      .status(201)
      .json({ title, description, message: 'Created successfully!' });
  } catch (error) {
    res.status(500).json(error?.message);
  }
});

// @desc    Get all task
// @route   GET /task/all
// @access  Private
const getAllTask = async (req, res) => {
  try {
    const getTaskData = await Task.find({});
    res.status(200).json(getTaskData);
  } catch (error) {
    res.status(500).json(error?.message);
  }
};

// @desc    Get all task
// @route   GET /task/update
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { _id, ...updateFields } = req.body;
    const task = await Task.findById(_id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    Object.assign(task, updateFields);

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).send(error?.message);
  }
};

// @desc    Delete task
// @route   DELETE /task/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.json({ message: 'Task deleted successfully', deletedTask });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'An error occurred',
    });
  }
});

export { createTask, getAllTask, updateTask, deleteTask };
