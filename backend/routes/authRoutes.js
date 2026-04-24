import express from "express";
import { register, login } from "../controllers/userController.js";

import { registerValidator, loginValidator } from "../validators/authValidator.js";
import validate from "../middleware/validate.js";

import jwt from "jsonwebtoken";
import passport from "passport";
import { verifyOtp } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/auth?mode=login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(
      `http://localhost:3000/todo?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          isPremium: req.user.isPremium,
          plan: req.user.plan,
        })
      )}`
    );
  }
);

router.post("/verify-otp", verifyOtp);

export default router;