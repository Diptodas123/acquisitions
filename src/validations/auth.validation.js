import zod from "zod";

export const signupSchema = zod.object({
  name: zod.string().min(2).max(255).trim(),
  email: zod.email().trim().toLowerCase(),
  password: zod.string().min(8).max(128),
  role: zod.enum(["user", "admin"]).default("user"),
});

export const signinSchema = zod.object({
  email: zod.email().trim().toLowerCase(),
  password: zod.string().min(8),
});
