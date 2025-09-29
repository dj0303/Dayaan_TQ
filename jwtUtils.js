// jwtUtils.js
import jwt from "jsonwebtoken";

export function setUser(user) {
  return jwt.sign({ id: user.UID, username: user.USERNAME }, process.env.SUPER_SECRET_KEY, { expiresIn: "1h" });
}

export function getUser(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.SUPER_SECRET_KEY);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return "EXPIRED";
    }
    return null; 
  }
}