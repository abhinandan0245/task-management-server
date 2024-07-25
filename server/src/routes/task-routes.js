import { Router } from "express";

import { authentication } from "../middlewares/authentication.js";
import { checkForValidationError } from "../middlewares/validation-handler.js";

import {
  create,
  deleteTask,
  details,
  updateDetails,
  updateStatus,
} from "../validations/task-validations.js";
import {
  createController,
  deleteTaskController,
  detailsController,
  searchController,
  updateDetailsController,
  updateStatusController,
} from "../controllers/task-controllers.js";

export const TaskRouter = Router();

TaskRouter.post(
  "/create",
  authentication,
  create(),
  checkForValidationError,
  createController
);

TaskRouter.get("/search", authentication, searchController);
TaskRouter.get(
  "/details/:taskid",
  authentication,
  details(),
  checkForValidationError,
  detailsController
);

TaskRouter.patch(
  "/update/:taskid",
  authentication,
  updateDetails(),
  checkForValidationError,
  updateDetailsController
);
TaskRouter.patch(
  "/update/status/:taskid",
  authentication,
  updateStatus(),
  checkForValidationError,
  updateStatusController
);

TaskRouter.delete(
  "/delete/:taskid",
  authentication,
  deleteTask(),
  checkForValidationError,
  deleteTaskController
);
