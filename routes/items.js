import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import Item from "../models/item.js";
import User from "../models/user.js";
import Transaction from "../models/transaction.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const items = await Item.findAll();
        res.json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/buy/:id", authMiddleware, async (req, res) => {
    try {
        const itemId = req.params.id;
        const { quantity }= req.body;
        const user = await User.findByPk(req.user.id);
        const item = await Item.findByPk(itemId);
        const amount = item.PRICE * quantity;

        if(!user || !item) return res.status(404).json({ error: "User or Item Not Found" });
        if(user.WALLET_BAL < amount) return res.status(400).json({ error: "Insufficient Balance" });
        if(item.STOCK <= 0) return res.status(400).json({ error: "Item Out of Stock" });

        user.WALLET_BAL -= amount;
        item.STOCK -= quantity;

        await user.save();
        await item.save();

        await Transaction.create({
            UID: user.UID,
            IID: item.IID,
            AMOUNT: amount,
            QUANTITY: quantity
        });

        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" })
    }
});

export default router;