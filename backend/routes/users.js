const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const usersModel = require("../models/users");
const { authorize } = require("../middleware/auth");

// POST /users/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Email and password required.", details: {} } });
  }
  const user = usersModel.findByEmailAndPassword(email, password);
  if (!user) {
    return res.status(401).json({ success: false, data: null, error: { code: "UNAUTHORIZED", message: "Invalid email or password.", details: {} } });
  }
  return res.json({ success: true, data: { userId: user.userId, email: user.email, userRole: user.userRole, firstName: user.firstName }, error: null });
});

// GET /users
router.get("/", authorize("admin", "employee"), usersController.getAllUsers);
router.get("/:id", authorize("admin", "employee"), usersController.getUserById);
router.post("/", authorize("admin"), usersController.createUser);
router.put("/:id", authorize("admin", "employee"), usersController.updateUser);
router.delete("/:id", authorize("admin"), usersController.deleteUser);

module.exports = router;