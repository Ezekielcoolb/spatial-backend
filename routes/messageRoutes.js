const express = require("express");
const router = express.Router();
const UserMessage = require("../models/Messages");

// @route   POST /api/messages
// @desc    Save a new user message
// @access  Public
router.post("/post-message", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    // Validation (basic example)
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new UserMessage({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    });

    await newMessage.save();

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// (Optional) Get all messages (for admin use)
router.get("/", async (req, res) => {
  try {
    const messages = await UserMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const message = await UserMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    await message.deleteOne();
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
