import express from "express";
import { addComment, deletePost, getFeedPosts, getPost, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:id", verifyToken, getPost);
/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

router.delete("/:id", verifyToken, deletePost);

router.patch("/:id", verifyToken, addComment);

export default router;
