const express = require("express");
const { CommentModel } = require("../Models/comment.model");
const { auth } = require("../Middlewares/auth.middleware");

const commentRouter = express.Router();

commentRouter.post("/add", auth, async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const newComment = new CommentModel({
      postId,
      userId: req.user._id,
      comment
    });
    await newComment.save();
    res.status(201).json({ message: "Comment added successfully", newComment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

commentRouter.get("/:postId", auth, async (req, res) => {
  try {
    const comments = await CommentModel.find({ postId: req.params.postId }).populate("userId", "username email");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

commentRouter.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.userId.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized action" });
    }
    await comment.remove();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { commentRouter };
