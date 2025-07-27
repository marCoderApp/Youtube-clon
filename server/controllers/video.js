import Video from "../../server/models/Video.js";
import User from "../../server/models/User.js";
import { createError } from "../error.js";

//ADD VIDEO

export const addVideo = async (req, res, next) => {
  // CREATE NEW VIDEO OBJECT WITH USER ID AND REQUEST BODY
  const newVideo = new Video({ userId: "633e26e6a963f95c4c4f30e0", ...req.body });

  try {
    // SAVE THE VIDEO OBJECT CREATED BEFORE
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

// UPDATE VIDEO
export const updateVideo = async (req, res, next) => {
  try {
    // FIND THE VIDEO BY ID IN REQUEST PARAMS
    const video = await Video.findById(req.params.id);

    //CHECK IF THE VIDEO EXIST
    if (!video) return next(createError(404, "Video not found"));

    // CHECK IF THE USER ID IS THE SAME AS THE VIDEO.USERID
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video"));
    }
  } catch (error) {
    next(error);
  }
};

//DELETE VIDEO
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted");
    } else {
      return next(createError(403, "You can delete only your video"));
    }
  } catch (error) {
    next(error);
  }
};

// GET VIDEO BY ID
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    res.status(200).json(video);
  } catch (error) {}
};

//ADD VIEW
export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 0.5 },
    });

    res.status(200).json("The view has been increased");
  } catch (error) {}
};

// RANDOM
export const random = async (req, res, next) => {
  try {
    const video = await Video.aggregate([{ $sample: { size: 40 } }]);

    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

//TREND
export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });

    res.status(200).json(videos);
  } catch (error) {}
};

//SUB
export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};

//TAGS
export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  console.log(tags);
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);

    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

//SEARCH
export const search = async (req, res, next) => {
  const query = req.query.q;

  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);

    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
