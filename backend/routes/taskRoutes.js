import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleWare.js";
import { taskValidator } from "../validators/taskValidator.js";
import validate from "../middleware/validate.js";
import { getNotes } from "../controllers/taskController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", taskValidator, validate, createTask);
router.get("/", getTasks);
router.get("/notes", getNotes);
router.put("/:id", taskValidator, validate, updateTask);
router.delete("/:id", deleteTask);

export default router;