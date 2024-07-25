import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/user.js";

const signUpController = async (req, res, next) => {
  const { name, email, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await UserModel.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({ user: createdUser });
  } catch (error) {
    next(error);
  }
};

const signInController = async (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.log("JWT_SECRET key is missing!");

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong!",
    });
  }

  const user = req.user;

  try {
    const token = jwt.sign({ user }, JWT_SECRET, {
      expiresIn: "1day",
    });
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

const detailsController = async (req, res, next) => {
  const { user } = req.authenticationResponse;

  try {
    const userData = await UserModel.findOne({ _id: user._id });
    res.status(200).json({ user: userData });
  } catch (error) {
    next(error);
  }
};

const updateDetailsController = async (req, res, next) => {
  const { user } = req.authenticationResponse;

  const { name, email, username } = req.body;

  try {
    await UserModel.updateOne(
      { _id: user._id },
      {
        name,
        email,
        username,
      },
      { new: true }
    );

    res.status(201).json({ message: "User updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const updatePasswordController = async (req, res, next) => {
  const { user } = req.authenticationResponse;

  const newPassword = req.body.newPassword;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(201).json({ message: "User password updated successfully!" });
  } catch (error) {
    next(error);
  }
};

export {
  signUpController,
  signInController,
  detailsController,
  updateDetailsController,
  updatePasswordController,
};
