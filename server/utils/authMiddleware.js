import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token: "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "hh_super_secret_jwt_key_9988");

      // Find user, append to request (omit hashed password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User session not found" });
      }

      return next();
    } catch (error) {
      console.error(`JWT Verification Error: ${error.message}`);
      return res.status(401).json({ message: "Not authorized, session expired or invalid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
}

export function verifiedOnly(req, res, next) {
  if (req.user && req.user.isVerified) {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Email verification required." });
}

