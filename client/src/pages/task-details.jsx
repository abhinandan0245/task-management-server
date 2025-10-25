import {
  ArrowLeftIcon,
  CheckCheckIcon,
  PencilLineIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import { Button, buttonVariants } from "../components/ui/button";
import { Container } from "../components/ui/container";
import axios from "../api/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

export const TaskDetails = () => {
  const { taskid } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isRefresh, setIsRefresh] = useState(false);
  const [loading, setLoading] = useState(null);

  const handleFetchTaskDetails = async (signal) => {
    const token = localStorage.getItem("__tmutoken");

    try {
      const response = await axios.get(`/api/task/details/${taskid}`, {
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setTask(response.data?.task);
    } catch (error) {
      if (error.message !== "canceled") {
        setTask(null);
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    handleFetchTaskDetails(abortController.signal);

    return () => abortController.abort();
  }, [taskid, isRefresh]);

  const handleDeleteTask = async () => {
    setLoading("delete");

    const token = localStorage.getItem("__tmutoken");

    try {
      await axios.delete(`/api/task/delete/${taskid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setIsRefresh((prev) => !prev);
      setLoading(null);
      navigate("/tasks/");
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      setLoading(null);
    }
  };

  const handleChangeStatus = async () => {
    setLoading("status");

    const token = localStorage.getItem("__tmutoken");

    try {
      await axios.patch(
        `/api/task/update/status/${taskid}`,
        { status: task?.status === "completed" ? "incomplete" : "completed" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsRefresh((prev) => !prev);
      setLoading(null);
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      setLoading(null);
    }
  };

  const handleOnChildStatusChange = async (event) => {
    const { name, checked } = event.target;

    const newArray = task.content.map((item, index) =>
      index.toString() === name
        ? { ...item, status: checked ? "completed" : "incomplete" }
        : item
    );

    setTask({ ...task, content: newArray });

    const token = localStorage.getItem("__tmutoken");

    try {
      await axios.patch(
        `/api/task/update/${taskid}`,
        { ...task, content: newArray },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsRefresh((prev) => !prev);
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
    }
  };

  const handleOnChildDelete = async (index) => {
    const newArray = task.content.filter((_, idx) => index !== idx);

    setTask({ ...task, content: newArray });

    const token = localStorage.getItem("__tmutoken");

    try {
      await axios.patch(
        `/api/task/update/${taskid}`,
        { ...task, content: newArray },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsRefresh((prev) => !prev);
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <main className="h-full overflow-y-auto">
      <section className="py-6">
        <Container>
          {/* Header: Back + Actions */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex items-center gap-2">
              <Button
                onClick={() => navigate(-1)}
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
              <h1 className="flex text-sm font-semibold sm:text-lg dark:font-medium">
                Task details -{" "}
                <span className="text-blue-600">#{task?._id}</span>
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <Link
                to={`/tasks/details/${task?._id}/update/`}
                className={cn(buttonVariants("outline"), "text-blue-600")}
              >
                <PencilLineIcon className="w-4 h-4 mr-1" />
                Update
              </Link>

              <Button
                type="button"
                variant="outline"
                onClick={handleChangeStatus}
                className={`${
                  task?.status === "completed"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {task?.status === "completed" ? (
                  <>
                    <CheckCheckIcon className="w-4 h-4 mr-1" />
                    Marked as completed
                  </>
                ) : (
                  <>
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    Marked as incomplete
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleDeleteTask}
                className="text-red-600"
              >
                <Trash2Icon className="w-4 h-4 mr-1" />
                {loading === "delete" ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>

          {/* Task Details */}
          <div className="mt-6">
            {/* Mobile Card View */}
            <div className="flex flex-col gap-4 md:hidden">
              <div className="p-4 bg-white border rounded-lg dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                <p className="text-sm font-semibold text-zinc-500">
                  Task Title
                </p>
                <p className="text-base font-medium">{task?.title}</p>
              </div>

              <div className="p-4 bg-white border rounded-lg dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                <p className="text-sm font-semibold text-zinc-500">
                  Task Description
                </p>
                <p className="text-base">{task?.description}</p>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full mb-6 border-collapse">
                <thead className="text-white bg-zinc-900">
                  <tr>
                    <th className="w-40 p-2 font-medium text-start">Heading</th>
                    <th className="p-2 font-medium text-start">Contents</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-200">
                    <th className="w-40 p-2 font-semibold text-start">
                      Task Title
                    </th>
                    <td className="p-2 text-start">{task?.title}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <th className="w-40 p-2 font-semibold text-start">
                      Task Description
                    </th>
                    <td className="p-2 text-start">{task?.description}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Assigned To-dos */}
            <p className="mb-2 text-lg font-semibold">Assigned To-dos</p>
            <ul className="flex flex-col gap-2">
              {task?.content.length ? (
                task.content.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between gap-2 p-2 border rounded-md sm:flex-row sm:items-center border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={index}
                        className="w-4 h-4 accent-zinc-900 dark:accent-zinc-200"
                        checked={item?.status === "completed"}
                        onChange={handleOnChildStatusChange}
                      />
                      <p className="font-medium">{item?.title}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOnChildDelete(index)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </li>
                ))
              ) : (
                <li>
                  <p className="text-zinc-500">Content list is empty!</p>
                </li>
              )}
            </ul>
          </div>
        </Container>
      </section>
    </main>
  );
};
