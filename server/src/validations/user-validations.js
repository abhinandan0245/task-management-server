import { body } from "express-validator";
import bcrypt from "bcryptjs";

import { UserModel } from "../models/user.js";

const signUp = () => [
  body("name", "Name is required in 'user'!")
    .isString()
    .isLength({ min: 3, max: 24 })
    .withMessage("Name must be in the range of 3 to 24 characters!"),
  body("email", "Email is required in 'user'!")
    .isString()
    .isLowercase()
    .withMessage("Email address must be in lowercase!")
    .custom(async (email) => {
      await UserModel.findOne({ email }).then((response) => {
        if (response) throw new Error("Email address already registered!");

        return true;
      });
    }),
  body("username", "Username is required in 'user'!")
    .isString()
    .custom(async (username) => {
      await UserModel.findOne({ username }).then((response) => {
        if (response) throw new Error("Username is already taken!");

        return true;
      });
    }),
  body("password", "Password is required in 'user'!")
    .isString()
    .isStrongPassword()
    .withMessage(
      "Password must be a strong combination of numbers, alphabates and special characters!"
    ),
];

const signIn = () => [
  body("email", "Email is required in 'user'!")
    .isString()
    .isLowercase()
    .withMessage("Please provide email address in correct format!")
    .custom(async (email, { req }) => {
      await UserModel.findOne({ email }).then((response) => {
        if (!response) throw new Error("Received invalid email address!");

        req.user = response;
        return true;
      });
    }),
  body("password", "Password is required in 'user'!")
    .isString()
    .isStrongPassword()
    .withMessage("Please provide password in correct format!")
    .custom(async (password, { req }) => {
      const user = req.user;

      await bcrypt.compare(password, user.password).then((response) => {
        if (!response) throw new Error("Received invalid password!");
        return true;
      });
    }),
];

const updateDetails = () => [
  body("name", "Name is required in 'user'!")
    .isString()
    .isLength({ min: 3, max: 24 })
    .withMessage("Name must be in the range of 3 to 24 characters!"),
  body("email", "Email is required in 'user'!")
    .isString()
    .isLowercase()
    .withMessage("Email address must be in lowercase!")
    .custom(async (email, { req }) => {
      const { user } = req.authenticationResponse;

      await UserModel.findOne({ email }).then((response) => {
        if (response && user.email !== email)
          throw new Error("Email address already registered!");

        return true;
      });
    }),
  body("username", "Username is required in 'user'!")
    .isString()
    .custom(async (username, { req }) => {
      const { user } = req.authenticationResponse;

      await UserModel.findOne({ username }).then((response) => {
        if (response && user.username !== username)
          throw new Error("Username is already taken!");

        return true;
      });
    }),
];

const updatePassword = () => [
  body("oldPassword", "Old password is required in 'user'!")
    .isString()
    .isStrongPassword()
    .withMessage("Please provide password in correct format!")
    .custom(async (oldPassword, { req }) => {
      const { user } = req.authenticationResponse;

      await bcrypt.compare(oldPassword, user.password).then((response) => {
        if (!response) throw new Error("Received invalid old password!");
        return true;
      });
    }),
  body("newPassword", "New password is required in 'user'!")
    .isString()
    .isStrongPassword()
    .withMessage(
      "Password must be a strong combination of numbers, alphabates and special characters!"
    )
    .custom(async (newPassword, { req }) => {
      await bcrypt
        .compare(newPassword, req.body.oldPassword)
        .then((response) => {
          if (response)
            throw new Error(
              "New password cannot be same as your old password!"
            );
          return true;
        });
    }),
];

export { signUp, signIn, updateDetails, updatePassword };
