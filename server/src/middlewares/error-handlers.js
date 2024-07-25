const handleServerError = (error, req, res, next) => {
  const statusCode = req.statusCode || 500;

  const errorStatus =
    statusCode === 400
      ? "BAD_REQUEST"
      : statusCode === 404
      ? "NOT_FOUND"
      : "INTERNAL_SERVER_ERROR";
  const message = `${error.message}!` || "Something went wrong!";

  return res.status(statusCode).json({
    error: errorStatus,
    message,
  });
};

const handleNotFoundAPI = (req, res, next) => {
  return res.status(404).json({
    error: "NOT_FOUND",
    message: "Invalid API request!",
  });
};

export { handleServerError, handleNotFoundAPI };
