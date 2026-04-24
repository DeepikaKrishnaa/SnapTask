import Task from "../models/todo.js";
import redis from "../config/redisClient.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      type: req.body.type || "task",
      user: req.user.id,
    });

    await redis.del(`tasks:${req.user.id}`);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const key = `tasks:${userId}`;

    let cachedTasks = await redis.get(key);

    if (cachedTasks) {
      console.log("from redis cache");

      if (typeof cachedTasks === "string") {
        try {
          cachedTasks = JSON.parse(cachedTasks);
        } catch (e) {
          cachedTasks = [];
        }
      }

      return res.status(200).json(cachedTasks);
    }

    const tasks = await Task.find({
      user: userId,
      type: "task",
    });

    console.log("from mongodb");

    await redis.set(key, JSON.stringify(tasks));

    return res.status(200).json(tasks);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Task.find({
      user: req.user.id,
      type: "note",
    });

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      {
        returnDocument: "after",
        runValidators: false,
      }
    );

    if (!task) return res.status(404).json({ message: "Not found" });

    await redis.del(`tasks:${req.user.id}`);

    res.status(200).json(task);
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) return res.status(404).json({ message: "Not found" });

    await redis.del(`tasks:${req.user.id}`);

    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};