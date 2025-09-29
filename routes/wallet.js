import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import Item from "../models/item.js";
import Transaction from "../models/transaction.js";

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if(!user) return res.render("login.ejs", { error: "User not Found" });
        res.json({ balance: user.WALLET_BAL, user: {id: user.UID, username: user.USERNAME} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

router.post("/spend", authMiddleware, async (req, res) => {
    const { itemId, quantity } = req.body;

    if (!itemId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: "Invalid item or quantity" });
    } 

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const item = await Item.findByPk(itemId);
        if (!item) return res.status(404).json({ error: "Item not found" });

        const totalAmount = Number(item.AMOUNT) * Number(quantity);

        if (Number(user.WALLET_BAL) < totalAmount) {
            return res.render("index.ejs", { error: "Insufficient Balance" });
        }

        // Deduct from wallet
        user.WALLET_BAL -= totalAmount;
        await user.save();

        // Record transaction
        await Transaction.create({
            UID: user.UID,
            IID: item.IID,
            AMOUNT: totalAmount,
            QUANTITY: quantity
        });

        res.json({ balance: Number(user.WALLET_BAL) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error" });
    }
});

export default router;
