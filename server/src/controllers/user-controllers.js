import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignInController = async (req, res, next) => {
  const { token } = req.body; // coming from frontend GoogleLogin response

  try {
    // 1️⃣ Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload; // `sub` is Google's unique user ID

    // 2️⃣ Check if user already exists in DB
    let user = await UserModel.findOne({ email });

    if (!user) {
      // 3️⃣ Create new user if not found
      user = await UserModel.create({
        name: name || "Google User",
        email,
        username: email.split("@")[0],
        password: sub, // you can store Google's sub ID as password hash
      });
    }

    // 4️⃣ Create JWT for the user
    const JWT_SECRET = process.env.JWT_SECRET;
    const jwtToken = jwt.sign({ user }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Google Sign-In successful",
      user,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google Sign-In error:", error);
    res.status(401).json({
      error: "INVALID_GOOGLE_TOKEN",
      message: "Google authentication failed.",
    });
  }
};


export {
  signUpController,
  signInController,
  detailsController,
  updateDetailsController,
  updatePasswordController,
  googleSignInController
};
