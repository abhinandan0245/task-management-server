import { validationResult } from "express-validator";

export const checkForValidationError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "BAD_REQUEST",
      message: errors.array()[0].msg,
    });
  }

  return next();
};
