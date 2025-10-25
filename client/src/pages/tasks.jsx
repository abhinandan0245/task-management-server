import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/ui/container";
import { motion } from "framer-motion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import {
  CheckCheckIcon,
  ListCheckIcon,
  PencilLineIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import { Button, buttonVariants } from "../components/ui/button";
import { cn } from "../lib/cn";
import axios from "../api/axios";

export const Tasks = () => {
  const [filters, setFilters] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [loading, setLoading] = useState(null);

  const handleFetchTasks = async (signal) => {
    const token = localStorage.getItem("__tmutoken");

    try {
      const response = await axios.get(
        `/api/task/search?page=1&count=20${
          filters?.title ? `&title=${filters?.title}` : ""
        }${filters?.status ? `&status=${filters?.status}` : ""}`,
        {
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data?.tasks);
    } catch (error) {
      if (error.message !== "canceled") {
        setTasks([]);
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    handleFetchTasks(abortController.signal);

    return () => abortController.abort();
  }, [isRefresh, filters]);

  const handleDeleteTask = async (id) => {
    setLoading(id.toString().concat("delete"));

    const token = localStorage.getItem("__tmutoken");

    try {
      await axios.delete(`/api/task/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setIsRefresh((prev) => !prev);
      setLoading(null);
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      setLoading(null);
    }
  };

  const handleChangeStatus = async (id, status) => {
    setLoading(id.toString().concat("status"));

    const token = localStorage.getItem("__tmutoken");

    try {
      await axios.patch(
        `/api/task/update/status/${id}`,
        { status },
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

  const handleOnInputChange = (event) => {
    const value = event.target.value;

    setFilters({ ...filters, title: value });

    if (value.trim() == "") {
      delete filters["title"];
    }
  };

  const handleOnSelectChange = (event) => {
    const value = event.value;

    setFilters({ ...filters, status: value.toLowerCase() });

    if (value === "None") {
      setFilters({ ...filters, status: "" });
    }
  };

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // delay between cards
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <main className="h-full overflow-y-auto">
      <section>
        <Container>
          <div className="flex flex-col gap-4 py-3 md:flex-row md:items-center md:justify-between">
            {/* Left Section - Title */}
            <div className="inline-flex items-center gap-2">
              <ListCheckIcon className="w-5 h-5" />
              <h1 className="text-lg font-semibold dark:font-medium">
                My Tasks
              </h1>
            </div>

            {/* Right Section - Filters & Search */}
            <div className="flex flex-col items-stretch w-full gap-3 sm:flex-row sm:items-center md:w-auto">
              {/* Status Filter */}
              <Select
                value={filters?.status ?? "none"}
                onChange={handleOnSelectChange}
                className="w-full sm:w-40"
              >
                <SelectTrigger>
                  {filters?.status ?? "Filter by status"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem>None</SelectItem>
                  <SelectItem>Incomplete</SelectItem>
                  <SelectItem>Completed</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Input */}
              <Input
                type="search"
                placeholder="Search by task title"
                value={filters?.title ?? ""}
                onChange={handleOnInputChange}
                size="small"
                className="w-full outline-none sm:w-64 md:w-80"
              />
            </div>
          </div>

          {/* ✅ Responsive Task Table */}
          <div className="mt-4 overflow-x-auto">
            {/* Desktop Table */}
            <table className="hidden w-full text-sm text-left border-collapse md:table">
              <thead className="text-white bg-zinc-900">
                <tr>
                  <th className="p-2 font-medium">S.No</th>
                  <th className="p-2 font-medium">Title</th>
                  <th className="p-2 font-medium">Assigned To-dos</th>
                  <th className="p-2 font-medium">Description</th>
                  <th className="p-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks?.length ? (
                  tasks.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b border-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <td className="p-2">{index + 1}.</td>
                      <td className="p-2">
                        <Link
                          to={`/tasks/details/${item._id}`}
                          className="text-blue-600 underline dark:text-blue-400"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="p-2">
                        Includes {item.content?.length} to-dos
                      </td>
                      <td className="max-w-xs p-2 truncate">
                        {item.description}
                      </td>
                      <td className="p-2 text-right">
                        <span className="inline-flex items-center gap-1">
                          <Link
                            to={`/tasks/details/${item._id}/update`}
                            className={cn(
                              buttonVariants("ghost", "icon"),
                              "text-blue-600"
                            )}
                          >
                            <PencilLineIcon className="w-4 h-4" />
                          </Link>
                          {item.status === "incomplete" ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleChangeStatus(item._id, "completed")
                              }
                              className="text-orange-600"
                            >
                              {loading === item._id + "status" ? (
                                <span className="w-5 h-5 border-2 border-transparent rounded-full border-r-red-600 animate-spin" />
                              ) : (
                                <XCircleIcon className="w-4 h-4" />
                              )}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleChangeStatus(item._id, "incomplete")
                              }
                              className="text-green-600"
                            >
                              {loading === item._id + "status" ? (
                                <span className="w-5 h-5 border-2 border-transparent rounded-full border-r-green-600 animate-spin" />
                              ) : (
                                <CheckCheckIcon className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(item._id)}
                            className="text-red-600"
                          >
                            {loading === item._id + "delete" ? (
                              <span className="w-5 h-5 border-2 border-transparent rounded-full border-r-red-600 animate-spin" />
                            ) : (
                              <Trash2Icon className="w-4 h-4" />
                            )}
                          </Button>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-3 font-medium text-center">
                      Nothing to show here
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ✅ Mobile Card Layout */}
            {/* ✅ Mobile Card Layout with Animation */}
            <motion.div
              className="space-y-4 md:hidden"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {tasks?.length ? (
                tasks.map((item, index) => (
                  <motion.div
                    key={item._id}
                    variants={cardVariants}
                    className="relative p-4 bg-white border shadow-sm border-zinc-200 dark:border-zinc-700 rounded-xl dark:bg-zinc-900"
                  >
                    {/* 🧭 Clickable overlay link */}
                    <Link
                      to={`/tasks/details/${item._id}`}
                      className="absolute inset-0 z-0 rounded-xl"
                    ></Link>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {index + 1}. {item.title}
                        </h3>
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-1 rounded-md",
                            item.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm truncate text-zinc-600 dark:text-zinc-400">
                        {item.description || "No description provided"}
                      </p>
                      <p className="mt-2 text-xs text-zinc-500">
                        {item.content?.length || 0} to-dos assigned
                      </p>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Link
                          to={`/tasks/details/${item._id}/update`}
                          className={cn(
                            buttonVariants("outline", "sm"),
                            "text-blue-600 relative z-20 p-1"
                          )}
                        >
                          <PencilLineIcon className="w-4 h-4 mr-1" /> Edit
                        </Link>

                        {item.status === "incomplete" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="relative z-20 p-1 text-orange-600"
                            onClick={() =>
                              handleChangeStatus(item._id, "completed")
                            }
                          >
                            {loading === item._id + "status" ? (
                              <span className="w-5 h-5 border-2 border-transparent rounded-full border-r-orange-600 animate-spin" />
                            ) : (
                              <>
                                <XCircleIcon className="w-4 h-4 mr-1" /> Mark
                                Complete
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="relative z-20 p-1 text-green-600"
                            onClick={() =>
                              handleChangeStatus(item._id, "incomplete")
                            }
                          >
                            <CheckCheckIcon className="w-4 h-4 mr-1" /> Mark
                            Incomplete
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="relative z-20 p-1 text-red-600"
                          onClick={() => handleDeleteTask(item._id)}
                        >
                          <Trash2Icon className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  variants={cardVariants}
                  className="py-4 font-medium text-center text-zinc-700 dark:text-zinc-300"
                >
                  Nothing to show here
                </motion.p>
              )}
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
};
