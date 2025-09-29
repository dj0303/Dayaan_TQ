import express from "express"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.js";
import walletRoutes from "./routes/wallet.js";
import itemsRoutes from "./routes/items.js";
import Item from "./models/item.js";
import User from "./models/user.js"
import sequelize from "./db.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { getUser } from "./jwtUtils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()
const port = 3000;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.use("/wallet", walletRoutes);
app.use('/items', itemsRoutes)

dotenv.config();

app.get("/", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.render("register.ejs");

  const decoded = getUser(token);

  if (decoded === "EXPIRED") return res.render("login.ejs");
  if (!decoded) return res.status(401).send("Invalid token");

  const user = await User.findByPk(decoded.id);
  if (!user) return res.redirect("/auth/register");

  const items = await Item.findAll();
  res.render("index.ejs", { name: user.USERNAME, wallet: Number(user.WALLET_BAL), items });
});

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced!");

    app.listen(port, () => {
        console.log(`Server running on Port ${port}`);
    });
  } catch (err) {
    console.error("DB sync failed:", err);
  }
};

syncDB();
