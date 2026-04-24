import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

export default app;