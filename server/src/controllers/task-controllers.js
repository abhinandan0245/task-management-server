import { TaskModel } from "../models/task.js";

const createController = async (req, res, next) => {
  const { user } = req.authenticationResponse;
  const { title, description, content } = req.body;

  const taskContent =
    content && Array.isArray(content)
      ? content.map((item) => ({
          status: "incomplete",
          title: item,
        }))
      : [];

  try {
    const createdTask = await TaskModel.create({
      user: user._id,
      title,
      description,
      content: taskContent,
    });

    res.status(201).json({ task: createdTask });
  } catch (error) {
    next(error);
  }
};

const searchController = async (req, res, next) => {
  const { user } = req.authenticationResponse;

  const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
  const count = req.query.count ? parseInt(req.query.count.toString()) : 20;

  const title = req.query.title;
  const status = req.query.status;

  const searchQueries = { user: user?._id };

  if (title)
    searchQueries.title = {
      $regex: title,
      $options: "i",
    };
  if (status) searchQueries.status = status;

  try {
    const [tasks, counts] = await Promise.all([
      await TaskModel.find(searchQueries)
        .limit(count)
        .skip(page * count - count),
      await TaskModel.countDocuments(searchQueries),
    ]);

    const pages = counts > 0 ? Math.ceil(counts / count) : 0;

    res.status(200).json({ tasks, counts, page: counts > 0 ? page : 0, pages });
  } catch (error) {
    next(error);
  }
};

const detailsController = async (req, res, next) => {
  const task = req.task;

  try {
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

const updateDetailsController = async (req, res, next) => {
  const task = req.task;
  const { title, description, content } = req.body;

  const taskContent =
    content && Array.isArray(content)
      ? content.map((item) => ({
          status: typeof item === "string" ? "incomplete" : item.status,
          title: typeof item === "string" ? item : item.title,
        }))
      : [];

  try {
    await task.updateOne(
      {
        title,
        description,
        content: taskContent,
      },
      { new: true }
    );

    res.status(200).json({ message: "Task updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const updateStatusController = async (req, res, next) => {
  const task = req.task;
  const status = req.body.status;

  try {
    await task.updateOne(
      {
        status,
      },
      { new: true }
    );

    res.status(200).json({ message: "Task status updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const deleteTaskController = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export {
  createController,
  searchController,
  detailsController,
  updateDetailsController,
  updateStatusController,
  deleteTaskController,
};
