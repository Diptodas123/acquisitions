import logger from "#config/logger.js";
import { createUser, autheticateUser } from "#services/auth.service.js";
import { cookies } from "#utils/cookies.js";
import { formatValidationErrors } from "#utils/format.js";
import { jwtToken } from "#utils/jwt.js";
import { signupSchema, signinSchema } from "#validations/auth.validation.js";

export const signup = async (req, res, next) => {
  try {
    // Validate request body
    const validationResult = signupSchema.safeParse(req.body);

    // Handle validation errors
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationErrors(validationResult.error),
      });
    }

    // Create new user
    const { name, email, password, role } = validationResult.data;
    const newUser = await createUser(name, email, password, role);

    // Generate JWT token and set it in cookies
    const token = jwtToken.sign({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    cookies.set(res, "token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

    logger.info(`User signed up successfully: ${email}`);
    return res.status(201).json({
      message: "User signed up successfully",
      user: newUser,
    });
  } catch (e) {
    logger.error("Signup error:", e);

    if (e.message === "User with this email already exists") {
      return res.status(409).json({ error: e.message });
    }

    next(e);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await autheticateUser(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, "token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

    logger.info(`User signed in successfully: ${email}`);
    return res.status(200).json({
      message: "User signed in successfully",
      user,
    });
  } catch (e) {
    logger.error("Signin error:", e);

    if (e.message === "User not found" || e.message === "Invalid password") {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    next(e);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, "token");

    logger.info("User signed out successfully");
    return res.status(200).json({ message: "User signed out successfully" });
  } catch (e) {
    logger.error("Signout error:", e);
    next(e);
  }
};
