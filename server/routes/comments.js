import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
} from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//Add a new comment.
router.post("/", verifyToken, addComment);

//Delete a comment.
router.delete("/:id", verifyToken, deleteComment);

//Get all comments of a video.
router.get("/:videoId", getComments);

export default router;
