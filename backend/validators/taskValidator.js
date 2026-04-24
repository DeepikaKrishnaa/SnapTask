import { body } from "express-validator";

export const taskValidator = [
  body("title").notEmpty().withMessage("Title required"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"]),
];