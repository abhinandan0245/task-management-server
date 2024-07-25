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
          <div className="py-2 flex items-center justify-between gap-1">
            <span className="inline-flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
              <h1 className="text-base font-semibold dark:font-medium">
                Task details -{" "}
                <span className="text-blue-600">#{task?._id}</span>
              </h1>
            </span>
            <span className="inline-flex items-center justify-end gap-1">
              <Link
                to={`/tasks/details/${task?._id}/update/`}
                className={cn(buttonVariants("outline"), "text-blue-600")}
              >
                <PencilLineIcon className="w-4 h-4 me-2" />
                Update
              </Link>
              {task?.status === "incomplete" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleChangeStatus}
                  className="text-orange-600"
                >
                  <XCircleIcon className="w-4 h-4 me-2" />
                  {loading === "status"
                    ? "Updating..."
                    : "Marked as incomplete"}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleChangeStatus}
                  className="text-green-600"
                >
                  <CheckCheckIcon className="w-4 h-4 me-2" />
                  {loading === "status" ? "Updating..." : "Marked as completed"}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleDeleteTask}
                className="text-red-600"
              >
                <Trash2Icon className="w-4 h-4 me-2" />
                {loading === "delete" ? "Deleting" : "Delete"}
              </Button>
            </span>
          </div>
          <div className="w-full">
            <table className="w-full mb-6">
              <thead className="bg-zinc-900 text-white">
                <tr className="border-b border-b-zinc-200">
                  <th className="w-40 p-2 text-start align-middle font-medium">
                    Heading
                  </th>
                  <th className="p-2 text-start align-middle font-medium">
                    Contents
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-b-zinc-200">
                  <th className="w-40 p-2 text-start align-middle font-semibold">
                    Task Title
                  </th>
                  <td className="p-2 text-start align-middle">{task?.title}</td>
                </tr>
                <tr className="border-b border-b-zinc-200">
                  <th className="w-40 p-2 text-start align-top font-semibold">
                    Task Description
                  </th>
                  <td className="p-2 text-start align-top">
                    {task?.description}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-lg font-semibold mb-2">Assigned To-dos</p>
            <ul className="flex flex-col gap-1 mb-10">
              {task?.content.length ? (
                task?.content.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-3 border border-zinc-200 rounded-md p-1 ps-3"
                  >
                    <input
                      type="checkbox"
                      name={index}
                      className="w-4 h-4 accent-zinc-900"
                      checked={item?.status === "completed"}
                      onChange={handleOnChildStatusChange}
                    />
                    <p className="flex-1 font-medium">{item?.title}</p>
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
