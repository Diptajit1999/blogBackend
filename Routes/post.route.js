const express = require("express");
const { PostModel } = require("../Models/blogPost.model");
const { auth } = require("../Middlewares/auth.middleware");

const blogRouter = express.Router();

blogRouter.post("/add", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new PostModel({
      title,
      content,
      authorId: req.user._id
    });
    await post.save();
    res.status(201).json({ message: "Post added successfully", post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

blogRouter.get("/", auth, async (req, res) => {
  try {
    const posts = await PostModel.find().populate("authorId", "username email");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

blogRouter.get("/:id", auth, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id).populate("authorId", "username email");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

blogRouter.put("/:id", auth, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.authorId.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized action" });
    }
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.updatedAt = Date.now();
    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

blogRouter.delete("/:id", auth, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.authorId.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized action" });
    }
    await post.remove();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

blogRouter.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
    } else {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id);
    }
    await post.save();
    res.status(200).json({ message: "Like status updated", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { blogRouter };
