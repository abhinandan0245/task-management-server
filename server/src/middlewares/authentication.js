import jwt from "jsonwebtoken";

export const authentication = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.log("JWT_SECRET key is missing!");

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong!",
    });
  }

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      error: "BAD_REQUEST",
      message: "Authentication token is missing!",
    });
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded)
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Unauthenticated token!",
    });

  req.authenticationResponse = decoded;

  return next();
};
