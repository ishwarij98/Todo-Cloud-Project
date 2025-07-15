import express from "express";
import userModel from "../../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// GET all users

router.get("/getall", async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET user by ID

router.get("/myprofile", async (req, res) => {
  try {
    const userId = req.user.id; // `id` must be present in your JWT payload
    const user = await userModel.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE user by ID (with password hash if password is updated)

// UPDATE profile - only the logged-in user can update their data
router.put("/update", async (req, res) => {
  try {
    let id = req.user.id;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update provided fields
    const { fullName, email, phone, password } = req.body;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    res.status(200).json({ msg: "User updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE user by ID
router.delete("/delete", async (req, res) => {
  try {
    let id = req.user.id;
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE all users
router.delete("/deleteall", async (req, res) => {
  try {
    await userModel.deleteMany();
    res.status(200).json({ msg: "All users deleted" });
  } catch (error) {
    console.error("Error deleting all users:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Todo Apis

// GET ALL TODOS
router.get("/todos", async (req, res) => {
  try {
    let id = req.user.id;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user.todos);
  } catch (error) {
    console.error("Error getting todos:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// CREATE TODO
router.post("/addtodo", async (req, res) => {
  try {
    let id = req.user.id;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title and Description required" });
    }

    const newTodo = {
      title,
      description,
    };

    user.todos.push(newTodo);
    await user.save();

    res.status(201).json({ msg: "Todo Added", todos: user.todos });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE TODO
router.put("/updatetodo/:todoId", async (req, res) => {
  try {
    let id = req.user.id;
    let todoId = req.params.todoId;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const todo = user.todos.id(todoId);

    if (!todo) return res.status(404).json({ msg: "Todo not found" });

    const { title, description, isCompleted } = req.body;

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (isCompleted !== undefined) todo.isCompleted = isCompleted;

    await user.save();
    res.status(200).json({ msg: "Todo updated", todo });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE TODO
router.delete("/deletetodo/:todoId", async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const todoId = req.params.todoId;

    const todo = user.todos.id(todoId);
    if (!todo) return res.status(404).json({ msg: "Todo not found" });

    user.todos.pull(todoId); // ✅ this works even in Mongoose 7+
    await user.save();

    res.status(200).json({ msg: "Todo deleted", todos: user.todos });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE ALL TODOS
router.delete("/deletealltodo", async (req, res) => {
  try {
    let id = req.user.id;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.todos = [];
    await user.save();
    res.status(200).json({ msg: "All todos deleted" });
  } catch (error) {
    console.error("Error deleting all todos:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
