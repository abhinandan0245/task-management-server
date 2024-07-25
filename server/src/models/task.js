import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User id is required in 'task'!"],
      ref: "user",
    },
    title: { type: String, required: [true, "Title is required in 'task'!"] },
    description: {
      type: String,
      required: [true, "Description is required in 'task'!"],
    },
    content: { type: Array, required: false },
    status: {
      type: String,
      required: [true, "Status is required in 'task'!"],
      lowercase: true,
      default: "incomplete",
    },
  },
  { timestamps: true }
);

export const TaskModel = model("task", TaskSchema);
