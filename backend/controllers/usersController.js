// controllers/usersController.js

const usersModel = require("../models/users");
const { successResponse, errorResponse } = require("../middleware/response");

// GET /users
function getAllUsers(req, res) {
  const users = usersModel.getAll();
  return successResponse(res, users);
}

// GET /users/:id
function getUserById(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid user ID.", { field: "id" });
  }
  const user = usersModel.getById(id);
  if (!user) {
    return errorResponse(res, 404, "NOT_FOUND", `User with ID ${id} not found.`, {});
  }
  return successResponse(res, user);
}

// POST /users
function createUser(req, res) {
  const { firstName, lastName, userRole } = req.body;

  if (!firstName || !lastName) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Missing required fields: firstName and lastName.", {
      missingFields: [!firstName && "firstName", !lastName && "lastName"].filter(Boolean)
    });
  }

  const validRoles = ["admin", "employee", "consumer"];
  if (userRole && !validRoles.includes(userRole)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", `Invalid userRole. Allowed: ${validRoles.join(", ")}.`, {
      field: "userRole",
      allowedValues: validRoles
    });
  }

  const newUser = usersModel.create({ firstName, lastName, userRole });
  return successResponse(res, { userId: newUser.userId }, 201);
}

// PUT /users/:id
function updateUser(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid user ID.", { field: "id" });
  }

  const { firstName, lastName, userRole } = req.body;
  if (!firstName && !lastName && !userRole) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "At least one field must be provided: firstName, lastName, userRole.", {});
  }

  const validRoles = ["admin", "employee", "consumer"];
  if (userRole && !validRoles.includes(userRole)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", `Invalid userRole. Allowed: ${validRoles.join(", ")}.`, {
      field: "userRole",
      allowedValues: validRoles
    });
  }

  const updated = usersModel.update(id, { firstName, lastName, userRole });
  if (!updated) {
    return errorResponse(res, 404, "NOT_FOUND", `User with ID ${id} not found.`, {});
  }
  return successResponse(res, { userId: updated.userId });
}

// DELETE /users/:id
function deleteUser(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid user ID.", { field: "id" });
  }
  const removed = usersModel.remove(id);
  if (!removed) {
    return errorResponse(res, 404, "NOT_FOUND", `User with ID ${id} not found.`, {});
  }
  return successResponse(res, { userId: removed.userId });
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
