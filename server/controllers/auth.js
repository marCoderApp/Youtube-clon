import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const access = {
  token: "",
};

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();

    next(res.state(200).send("User has been created"));
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) {
      return next(createError(404, "Wrong Credentials!"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT);

    access.token = token;

    console.log(access);

    console.log("Este es el token desde auth.js: " + token);

    const { password, ...others } = user._doc;

    res
      .cookie("jwt", token, {
        httpOnly: false,
        secure: true,
      })
      .status(200)
      .json(others);
    //Aca se puede enviar el token dentro del json
  } catch (err) {
    next(createError(404, "Not Found"));
  }
};

//Auth with google function
export const googleAuth = async (req, res, next) => {
  console.log("en google auth");
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      access.token = token;

      res
        .cookie("jwt", token, {
          httpOnly: false,
          secure: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });

      const savedUser = await newUser.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      access.token = token;

      res
        .cookie("jwt", token, {
          httpOnly: false,
          secure: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
