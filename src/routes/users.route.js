import {
  fetchAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "#controllers/users.controller.js";
import { authenticate, authorize } from "#middleware/auth.middleware.js";
import { validateBody, validateParams } from "#middleware/validation.middleware.js";
import { updateUserSchema, userIdSchema } from "#validations/users.validation.js";
import express from "express";

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Admin only routes
router.get("/", authorize("admin"), fetchAllUsers);
router.delete("/:id", validateParams(userIdSchema), authorize("admin"), deleteUserById);

// Authenticated user routes
router.get("/:id", validateParams(userIdSchema), getUserById);
router.put("/:id", validateParams(userIdSchema), validateBody(updateUserSchema), updateUserById);

export default router;
