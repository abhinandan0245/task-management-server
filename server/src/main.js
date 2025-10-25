import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import {
  handleNotFoundAPI,
  handleServerError,
} from "./middlewares/error-handlers.js";
import { UserRouter } from "./routes/user-routes.js";
import { TaskRouter } from "./routes/task-routes.js";
import { connectDb } from "./config/db.js";

const app = express();

// Start server
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:5173"] }));
// app.use(cors());



// Connect to MongoDB
connectDb();

// routes 
app.use("/api/user", UserRouter);
app.use("/api/task", TaskRouter);

// Middleware
app.use(handleNotFoundAPI);
app.use(handleServerError);

// Start server
app.listen(port, () =>
  console.log(`Server is running on: http://localhost:${port}/`)
);
