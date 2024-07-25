import { body, param } from "express-validator";

import { TaskModel } from "../models/task.js";

const create = () => [
  body("title", "Title is required in 'task'!").isString(),
  body("description", "Description is required in 'task'!").isString(),
];

const details = () => [
  param("taskid", "Task id is required in 'task'!")
    .isString()
    .custom(async (taskid, { req }) => {
      await TaskModel.findOne({ _id: taskid }).then((response) => {
        if (!response) throw new Error("Received invalid task id!");

        req.task = response;
        return true;
      });
    }),
];

const updateDetails = () => [
  param("taskid", "Task id is required in 'task'!")
    .isString()
    .custom(async (taskid, { req }) => {
      await TaskModel.findOne({ _id: taskid }).then((response) => {
        if (!response) throw new Error("Received invalid task id!");

        req.task = response;
        return true;
      });
    }),
  body("title", "Title is required in 'task'!").isString(),
  body("description", "Description is required in 'task'!").isString(),
];

const updateStatus = () => [
  param("taskid", "Task id is required in 'task'!")
    .isString()
    .custom(async (taskid, { req }) => {
      await TaskModel.findOne({ _id: taskid }).then((response) => {
        if (!response) throw new Error("Received invalid task id!");

        req.task = response;
        return true;
      });
    }),
  body("status", "Status is required in 'task'!")
    .isString()
    .isLowercase()
    .withMessage("Task status must be in lowercase!"),
];

const deleteTask = () => [
  param("taskid", "Task id is required in 'task'!")
    .isString()
    .custom(async (taskid) => {
      await TaskModel.findOneAndDelete({ _id: taskid }).then((response) => {
        if (!response) throw new Error("Received invalid task id!");
        return true;
      });
    }),
];

export { create, details, updateDetails, updateStatus, deleteTask };
