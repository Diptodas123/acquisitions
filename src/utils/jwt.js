import jwt from "jsonwebtoken";
import logger from "#config/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const jwtToken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (err) {
      logger.error("Error signing JWT:", err);
      throw new Error("Failed to sign JWT");
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      logger.error("Error verifying JWT:", err);
      throw new Error("Failed to verify JWT");
    }
  },
};
