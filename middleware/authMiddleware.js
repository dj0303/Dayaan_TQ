import { getUser } from "../jwtUtils.js";

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: "No token Provided" });
    }

    const user = getUser(token);

    if(!user) {
        return res.status(401).json({ error: "Invalid or Expired Token" });
    }

    req.user = user;
    next();
}
