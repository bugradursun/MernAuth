import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({
    message: "API is working",
  });
};

//update user

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    //req.params.id = /update/:id
    return next(errorHandler(401, "You can only update your account!"));
  } //if ids match => user can update
  try {
    if (req.body.password) {
      //if there is a password in the body => hash it
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc; // seperates password from the updated user
    //rest = UpdatedUser without password
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
