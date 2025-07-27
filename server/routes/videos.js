import express from "express";
import {
  addVideo,
  updateVideo,
  deleteVideo,
  getVideo,
  addView,
  trend,
  random,
  sub,
  getByTag,
  search,
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//create a video
router.post("/",  addVideo);

//Update a video

router.put("/:id", verifyToken, updateVideo);

//Delete a video

router.delete("/:id", verifyToken, deleteVideo);

//Get a video

router.get("/find/:id", getVideo);

//Increase Views
router.put("/view/:id", addView);

//Get trending videos
router.get("/trend", trend);

//Get random videos
router.get("/random", random);

router.get("/sub", verifyToken, sub);

router.get("/tags", getByTag);

router.get("/search", search);

export default router;
