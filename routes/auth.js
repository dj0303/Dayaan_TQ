import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { setUser } from "../jwtUtils.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ where: { USERNAME: username } });
    if (existingUser) {
      return res.render("register.ejs", { error: "Username already exists" });
    }

    const newUser = await User.create({
      USERNAME: username,
      PASSWORD_HASH: password,
    });

    const token = jwt.sign(
      { id: newUser.UID, username: newUser.USERNAME },
      process.env.SUPER_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await User.findOne({ where: { USERNAME: username } });
    if (!user) return res.render("login.ejs", { error: "User not found" });

    const valid = await user.validPassword(password);
    if (!valid) return res.render("login.ejs", { error: "Incorrect password" });

    const token = setUser(user);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token"); 
  res.render("register.ejs"); 
});

export default router;
