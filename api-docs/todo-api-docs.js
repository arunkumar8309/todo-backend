/**
 * API Documentation for Task Management
 */

const apiDocs = [
  // Create Task
  {
    name: "Create Task",
    method: "POST",
    url: "/api/tasks",
    description: "Creates a new task.",
    requestBody: {
      type: "application/json",
      example: {
        title: "Task Title",
        description: "Task description.", //optional
        status: "Pending",
        dueDate: "2025-01-05",
      },
    },
    responses: {
      201: {
        description: "Task created successfully.",
        example: {
          status: 201,
          message: "Task created successfully",
          data: {
            _id: "67778b7a7c05db95f78140c3",
            title: "Task Title",
            description: "Task description.",
            status: "Pending",
            dueDate: "2025-01-05T00:00:00.000Z",
            createdAt: "2025-01-03T07:02:18.389Z",
            updatedAt: "2025-01-03T07:02:18.389Z",
          },
        },
      },
      400: {
        description: "Invalid input data.",
        example: {
          status: 400,
          message: "Invalid data provided.",
        },
      },
      500: {
        description: "Internal server error.",
        example: {
          status: 500,
          message: "An error occurred while creating the task",
          error: "Detailed error message",
        },
      },
    },
  },

  // Get All Tasks
  {
    name: "Get All Tasks",
    method: "GET",
    url: "/api/tasks",
    queryParametersurl: "/api/tasks?page=1&limit=10&sortBy=title&order=asc",
    description: "Fetches all tasks with optional pagination and sorting.",
    queryParameters: {
      page: {
        type: "number",
        description: "The page number for pagination (default: 1).",
        example: 1,
      },
      limit: {
        type: "number",
        description:
          "The number of tasks per page for pagination (default: 10).",
        example: 10,
      },
      sortBy: {
        type: "string",
        description: "The field to sort the tasks by (default: 'createdAt').",
        example: "title",
      },
      order: {
        type: "string",
        description:
          "The order of sorting: 'asc' for ascending or 'desc' for descending (default: 'desc').",
        example: "asc",
      },
    },
    responses: {
      200: {
        description: "Tasks retrieved successfully.",
        example: {
          status: 200,
          message: "Tasks retrieved successfully",
          data: [
            {
              _id: "67778b7a7c05db95f78140c3",
              title: "Task 1",
              description: "Task description.",
              status: "Pending",
              dueDate: "2025-01-05T00:00:00.000Z",
              createdAt: "2025-01-03T07:02:18.389Z",
              updatedAt: "2025-01-03T07:02:18.389Z",
            },
            {
              _id: "67778b7a7c05db95f78140c4",
              title: "Task 2",
              description: "Another task description.",
              status: "In Progress",
              dueDate: "2025-01-06T00:00:00.000Z",
              createdAt: "2025-01-03T07:03:18.389Z",
              updatedAt: "2025-01-03T07:03:18.389Z",
            },
          ],
          meta: {
            totalTasks: 20,
            totalPages: 2,
            currentPage: 1,
            limit: 10,
          },
        },
      },
      404: {
        description: "No tasks found in the database.",
        example: {
          status: 404,
          message: "No tasks found",
        },
      },
      500: {
        description: "Internal server error.",
        example: {
          status: 500,
          message: "An error occurred while retrieving tasks",
          error: "Detailed error message",
        },
      },
    },
  },

  // Update Task
  {
    name: "Update Task",
    method: "PUT",
    url: "/api/tasks/:id",
    description: "Updates a task by its ID.",
    params: [
      {
        name: "id",
        required: true,
        description:
          "The unique identifier of the task to update. Must be a valid 24-character hexadecimal string.",
      },
    ],
    requestBody: {
      type: "application/json",
      example: {
        title: "Updated Task Title",
        description: "Updated task description.",
        status: "In Progress",
        dueDate: "2025-01-05T00:00:00.000Z",
      },
    },
    responses: {
      200: {
        description: "Task updated successfully.",
        example: {
          status: 200,
          message: "Task updated successfully",
          data: {
            _id: "67778b7a7c05db95f78140c3",
            title: "Updated Task Title",
            description: "Updated task description.",
            status: "In Progress",
            dueDate: "2025-01-05T00:00:00.000Z",
            createdAt: "2025-01-03T07:02:18.389Z",
            updatedAt: "2025-01-03T07:30:00.000Z",
          },
        },
      },
      400: {
        description: "Invalid input data or ID format.",
        example: {
          status: 400,
          message:
            "Invalid task ID format. Ensure the ID is 24 characters and hexadecimal.",
        },
      },
      404: {
        description: "Task not found.",
        example: {
          status: 404,
          message: "Task not found. Please check the ID and try again.",
        },
      },
      500: {
        description: "Internal server error.",
        example: {
          status: 500,
          message: "An error occurred while updating the task",
          error: "Detailed error message",
        },
      },
    },
  },

  // Delete Task
  {
    name: "Delete Task",
    method: "DELETE",
    url: "/api/tasks/:id",
    description: "Deletes a task by its ID.",
    params: [
      {
        name: "id",
        required: true,
        description:
          "The unique identifier of the task to delete. Must be a valid 24-character hexadecimal string.",
      },
    ],
    responses: {
      200: {
        description: "Task deleted successfully.",
        example: {
          status: 200,
          message: "Task deleted successfully",
          data: {
            _id: "67778b7a7c05db95f78140c3",
            title: "Task Title",
            status: "Pending",
            dueDate: "2025-01-04T00:00:00.000Z",
            createdAt: "2025-01-03T07:02:18.389Z",
            updatedAt: "2025-01-03T07:16:28.831Z",
            description: "task1",
          },
        },
      },
      400: {
        description: "Invalid task ID format.",
        example: {
          status: 400,
          message:
            "Invalid task ID format. Ensure the ID is 24 characters and hexadecimal.",
        },
      },
      404: {
        description: "Task not found.",
        example: {
          status: 404,
          message: "Task not found. Please check the ID and try again.",
        },
      },
      500: {
        description: "Internal server error.",
        example: {
          status: 500,
          message: "An error occurred while deleting the task",
          error: "Detailed error message",
        },
      },
    },
  },
];

module.exports = apiDocs;
