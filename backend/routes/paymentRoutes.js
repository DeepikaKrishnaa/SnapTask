import express from "express";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import User from "../models/user.js";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const { plan } = req.body;

    const amountMap = {
      plus: 19900,
    };

    const order = await razorpay.orders.create({
      amount: amountMap[plan],
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      plan: "plus",
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;