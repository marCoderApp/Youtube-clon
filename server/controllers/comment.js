import Comment from "../models/Comments.js";
import Video from "../models/Video.js";

//ADD A COMMENT
export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (error) {
    next(error);
  }
};

//DELETE A COMMENT
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(res.params.id);
    const video = await Video.findById(res.params.id);

    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("The comment has been deleted");
    } else {
      return next(createError(403, "You can delete only your comment"));
    }
  } catch (error) {
    next(error);
  }
};

//GET ALL COMMENTS OF A VIDEO.
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
