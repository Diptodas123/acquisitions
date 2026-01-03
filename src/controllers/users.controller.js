import logger from "#config/logger.js";
import {
  getAllUsers,
  getUserById as getUserByIdService,
  updateUser,
  deleteUser,
} from "#services/users.service.js";

export const fetchAllUsers = async (req, res) => {
  try {
    const allUsers = await getAllUsers();
    res.status(200).json({
      message: "Users fetched successfully.",
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error("Error fetching users", { error });
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  const requestingUserId = req.user.id;
  const isAdmin = req.user.role === "admin";

  // Users can only view their own profile unless they're admin
  if (userId !== requestingUserId && !isAdmin) {
    return res.status(403).json({ error: "You can only view your own profile" });
  }

  try {
    const user = await getUserByIdService(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({
      message: "User fetched successfully.",
      user,
    });
  } catch (error) {
    logger.error(`Error fetching user with ID: ${userId}`, { error });
    res.status(500).json({ error: "Failed to fetch user." });
  }
};

export const updateUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  const requestingUserId = req.user.id;
  const isAdmin = req.user.role === "admin";
  const { name, email, role } = req.body;

  // Users can only update their own profile unless they're admin
  if (userId !== requestingUserId && !isAdmin) {
    return res.status(403).json({ error: "You can only update your own profile" });
  }

  // Only admins can change roles
  if (role && !isAdmin) {
    return res.status(403).json({ error: "Only admins can change user roles" });
  }

  try {
    const user = await getUserByIdService(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role && isAdmin) updateData.role = role;

    const updatedUser = await updateUser(userId, updateData);
    res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    logger.error(`Error updating user with ID: ${userId}`, { error });
    res.status(500).json({ error: "Failed to update user." });
  }
};

export const deleteUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await getUserByIdService(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    await deleteUser(userId);
    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    logger.error(`Error deleting user with ID: ${userId}`, { error });
    res.status(500).json({ error: "Failed to delete user." });
  }
};
