import { db } from "#config/database.js";
import logger from "#config/logger.js";
import { users } from "#models/user.model.js";
import { eq } from "drizzle-orm";

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      })
      .from(users);
  } catch (error) {
    logger.error("Error fetching users", { error });
    throw new Error("Failed to fetch users.");
  }
};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  } catch (error) {
    logger.error("Error fetching user by ID", { error });
    throw new Error("Failed to fetch user.");
  }
};

export const updateUser = async (id, data) => {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      });

    return updatedUser;
  } catch (error) {
    logger.error("Error updating user", { error });
    throw new Error("Failed to update user.");
  }
};

export const deleteUser = async id => {
  try {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return deletedUser;
  } catch (error) {
    logger.error("Error deleting user", { error });
    throw new Error("Failed to delete user.");
  }
};
