import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2).max(255).trim().optional(),
  email: z.string().email().trim().toLowerCase().optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),
});
