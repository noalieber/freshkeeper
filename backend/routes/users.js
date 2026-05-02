// routes/users.js

const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { authorize } = require("../middleware/auth");

// GET /users - admin and employee can list all users
router.get("/", authorize("admin", "employee"), usersController.getAllUsers);

// GET /users/:id - admin, employee can get any user
router.get("/:id", authorize("admin", "employee"), usersController.getUserById);

// POST /users - admin only can create users
router.post("/", authorize("admin"), usersController.createUser);

// PUT /users/:id - admin and employee can update
router.put("/:id", authorize("admin", "employee"), usersController.updateUser);

// DELETE /users/:id - admin only can delete users
router.delete("/:id", authorize("admin"), usersController.deleteUser);

module.exports = router;
