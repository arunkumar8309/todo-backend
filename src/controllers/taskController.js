const mongoose = require("mongoose");
const Task = require("./../models/taskSchema");
const logger = require("./../services/logger");

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  // Log the incoming request for task creation
  logger.info("Received request to create a new task", {
    title,
    description,
    status,
    dueDate,
  });

  try {
    // Check if the required fields are provided
    if (!title || !status || !dueDate) {
      logger.warn("Missing required fields for task creation", {
        title,
        description,
        status,
        dueDate,
      });
      return res.status(400).json({
        status: 400,
        message: "All fields (title, status, dueDate) are required",
      });
    }

    // Check if the dueDate is in the past
    if (new Date(dueDate) < new Date()) {
      logger.warn("Attempt to create task with a due date in the past", {
        dueDate,
      });
      return res.status(400).json({
        status: 400,
        message: "Due date cannot be in the past",
        dueDate: dueDate,
      });
    }

    // Create a new task object with title and description after title
    const taskData = {
      title,
      description: description || "", // If no description, set to empty string
      status,
      dueDate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Create a new task object
    const task = new Task(taskData);

    // Save the task to the database
    const savedTask = await task.save();
    logger.info("Task created successfully", { taskId: savedTask._id });

    // Respond with the created task
    return res.status(201).json({
      status: 201,
      message: "Task created successfully",
      data: savedTask,
    });
  } catch (error) {
    // Handle validation errors or database errors
    if (error.name === "ValidationError") {
      logger.error("Validation error while creating task", {
        error: error.message,
      });
      return res.status(422).json({
        status: 422,
        message: "Validation error occurred",
        details: error.message,
      });
    }

    // Handle unexpected errors
    logger.error("Unexpected error while creating task", {
      error: error.message,
    });
    return res.status(500).json({
      status: 500,
      message: "Internal server error occurred while creating the task",
      details: error.message,
    });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  logger.info("Fetching all tasks");

  try {
    // Extract pagination and sorting parameters from query string
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Parse page and limit as integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the number of tasks to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch tasks from the database with pagination and sorting
    const tasks = await Task.find()
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limitNumber);

    // Count total tasks for pagination metadata
    const totalTasks = await Task.countDocuments();

    // Check if no tasks are found
    if (tasks.length === 0) {
      logger.warn("No tasks found in the database");
      return res.status(404).json({
        status: 404,
        message: "No tasks found",
      });
    }

    // Log and respond with the retrieved tasks
    logger.info(`Successfully fetched ${tasks.length} tasks`);
    return res.status(200).json({
      status: 200,
      message: "Tasks fetched successfully",
      data: tasks,
      meta: {
        totalTasks,
        totalPages: Math.ceil(totalTasks / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    // Log the error and respond with a structured error message
    logger.error("Error fetching tasks:", error.message, { error });
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching tasks",
      error: error.message,
    });
  }
};

// Update a task

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  logger.info(`Updating task with ID: ${id}`, {
    title,
    description,
    status,
    dueDate,
  });

  try {
    // Extended ID validation: Check if the ID is a valid 24-character hexadecimal string
    if (!mongoose.Types.ObjectId.isValid(id) || id.length !== 24) {
      logger.warn("Invalid task ID format", { taskId: id });
      return res.status(400).json({
        status: 400,
        message: "Invalid task ID format",
      });
    }

    // Check if the dueDate is in the past, only if it's being updated
    if (dueDate && new Date(dueDate) < new Date()) {
      logger.warn("Attempt to update task with due date in the past", {
        dueDate,
      });
      return res.status(400).json({
        status: 400,
        message: "Due date cannot be in the past",
      });
    }

    // Find the task by ID
    const task = await Task.findById(id);

    // Handle task not found
    if (!task) {
      logger.warn("Task not found during update", { taskId: id });
      return res.status(404).json({
        status: 404,
        message: "Task not found",
      });
    }

    // Update task properties only if new values are provided
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.updatedAt = Date.now(); // Ensure updatedAt is updated

    // Save the updated task
    const updatedTask = await task.save();

    logger.info("Task updated successfully", { taskId: updatedTask._id });
    return res.status(200).json({
      status: 200,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    // Handle unexpected errors
    logger.error("Error updating task:", error.message, { error });
    return res.status(500).json({
      status: 500,
      message: "An error occurred while updating the task",
      error: error.message,
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  logger.info(`Deleting task with ID: ${id}`);

  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id) || id.length !== 24) {
      logger.warn("Invalid task ID format provided for delete", { taskId: id });
      return res.status(400).json({
        status: 400,
        message:
          "Invalid task ID format. Ensure the ID is 24 characters and hexadecimal.",
      });
    }

    // Attempt to delete the task
    const deletedTask = await Task.findByIdAndDelete(id);

    // Handle case when the task is not found
    if (!deletedTask) {
      logger.warn("Task not found during delete", { taskId: id });
      return res.status(404).json({
        status: 404,
        message: "Task not found. Please check the ID and try again.",
      });
    }

    logger.info("Task deleted successfully", { taskId: id });
    return res.status(200).json({
      status: 200,
      message: "Task deleted successfully",
      data: deletedTask, // Return the deleted task details
    });
  } catch (error) {
    // Log and handle unexpected errors
    logger.error("Error deleting task:", error.message, { error });
    return res.status(500).json({
      status: 500,
      message: "An error occurred while deleting the task",
      error: error.message,
    });
  }
};
