import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },

  completed: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
    enum: ["task", "note"],
    default: "task",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Task", taskSchema);