import { Router } from "express";

import { authentication } from "../middlewares/authentication.js";
import { checkForValidationError } from "../middlewares/validation-handler.js";

import {
  signIn,
  signUp,
  updateDetails,
  updatePassword,
} from "../validations/user-validations.js";
import {
  detailsController,
  signInController,
  signUpController,
  updateDetailsController,
  updatePasswordController,
} from "../controllers/user-controllers.js";

export const UserRouter = Router();

UserRouter.post(
  "/sign-up",
  signUp(),
  checkForValidationError,
  signUpController
);
UserRouter.post(
  "/sign-in",
  signIn(),
  checkForValidationError,
  signInController
);

UserRouter.get("/details", authentication, detailsController);

UserRouter.patch(
  "/update",
  authentication,
  updateDetails(),
  checkForValidationError,
  updateDetailsController
);
UserRouter.patch(
  "/update/password",
  authentication,
  updatePassword(),
  checkForValidationError,
  updatePasswordController
);
