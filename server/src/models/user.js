import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required in 'user'!"] },
    email: {
      type: String,
      required: [true, "Email address is required in 'user'!"],
      lowercase: true,
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Username is required in 'user'!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required in 'user'!"],
    },
  },
  { timestamps: true }
);

export const UserModel = model("user", UserSchema);
