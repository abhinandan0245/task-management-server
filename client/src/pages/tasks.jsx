import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/ui/container";
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

  return (
    <main className="h-full overflow-y-auto">
      <section>
        <Container>
          <div className="py-3 flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2">
              <ListCheckIcon className="w-5 h-5" />
              <h1 className="text-base font-semibold dark:font-medium">
                My Tasks
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={filters?.status ?? "none"}
                onChange={handleOnSelectChange}
                className="w-40"
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
              <Input
                type="search"
                placeholder="Search by task title"
                value={filters?.title ?? ""}
                onChange={handleOnInputChange}
                size="small"
                className="outline-none w-80"
              />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-zinc-900 text-white">
              <tr>
                <th className="p-2 text-start align-middle font-medium">
                  S.No
                </th>
                <th className="p-2 text-start align-middle font-medium">
                  Title
                </th>
                <th className="p-2 text-start align-middle font-medium">
                  Assigned To-dos
                </th>
                <th className="p-2 text-start align-middle font-medium">
                  Description
                </th>
                <th className="p-2 text-end align-middle font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks?.length ? (
                tasks?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-b-zinc-200 transition-colors lg:hover:bg-zinc-50"
                  >
                    <td className="p-2 text-start align-middle">
                      {index + 1}.
                    </td>
                    <td className="p-2 text-start align-middle">
                      <Link
                        to={`/tasks/details/${item?._id}`}
                        className="underline"
                      >
                        {item?.title}
                      </Link>
                    </td>
                    <td className="p-2 text-start align-middle">
                      Includes {item?.content?.length}+ to-dos
                    </td>
                    <td className="p-2 text-start align-middle">
                      <p className="max-w-xl w-full truncate">
                        {item?.description}
                      </p>
                    </td>
                    <td className="p-2 text-end align-middle">
                      <span className="inline-flex items-center justify-end gap-1">
                        <Link
                          to="/tasks/details/taskid/update/"
                          className={cn(
                            buttonVariants("ghost", "icon"),
                            "text-blue-600"
                          )}
                        >
                          <PencilLineIcon className="w-4 h-4" />
                        </Link>
                        {item?.status === "incomplete" ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleChangeStatus(item?._id, "completed")
                            }
                            className="text-orange-600"
                          >
                            {loading ===
                            item?._id?.toString().concat("status") ? (
                              <span className="w-6 h-6 rounded-full border-2 border-transparent border-r-red-600 animate-spin inline-block" />
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
                              handleChangeStatus(item?._id, "incomplete")
                            }
                            className="text-green-600"
                          >
                            {loading ===
                            item?._id?.toString().concat("status") ? (
                              <span className="w-6 h-6 rounded-full border-2 border-transparent border-r-green-600 animate-spin inline-block" />
                            ) : (
                              <CheckCheckIcon className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleDeleteTask(item?._id)}
                          className="text-red-600"
                        >
                          <Trash2Icon className="w-4 h-4 me-2" />
                          {loading === item?._id?.toString().concat("delete")
                            ? "Deleting"
                            : "Delete"}
                        </Button>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-2 font-medium">
                    Nothing to show here
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Container>
      </section>
    </main>
  );
};
