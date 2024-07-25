import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Container } from "../components/ui/container";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const UpdateTask = () => {
  const { taskid } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
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
  }, [taskid]);

  const handleOnKeyDown = (event) => {
    if (event.key === "/" && event.target.value.trim() !== "") {
      setTask({ ...task, content: [...task.content, event.target.value] });

      setTimeout(() => (event.target.value = ""), 100);
    } else if (
      event.key === "Backspace" &&
      event.target.value === "" &&
      task.content.length
    ) {
      setTimeout(
        () =>
          (event.target.value =
            task.content[task.content.length - 1]?.title ??
            task.content[task.content.length - 1]),
        100
      );
      setTask({
        ...task,
        content: task.content.filter(
          (_, index) => index !== task.content.length - 1
        ),
      });
    }
  };

  const handleOnInputChange = (event) => {
    const { name, value } = event.target;

    setTask({ ...task, [name]: value });
  };

  const handleOnChildDelete = async (index) => {
    const newArray = task.content.filter((_, idx) => index !== idx);

    setTask({ ...task, content: newArray });
  };

  const handleOnFormSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("__tmutoken");

    if (!token) {
      alert("Session expired, please login again to conitnue!");

      localStorage.clear();
      window.location.reload();
    }

    if (!task?.title || !task?.description) {
      alert("Please fill up the required fields to continue!");
      return;
    }

    try {
      await axios.patch(`/api/task/update/${taskid}`, task, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate(`/tasks/details/${taskid}`);
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <main className="h-full overflow-y-auto">
      <section className="py-6">
        <Container>
          <div className="py-2 flex items-center gap-1 mb-6 border-b border-b-zinc-200">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
            <h1 className="text-base font-semibold dark:font-medium">
              Update task
            </h1>
          </div>
          <form onSubmit={handleOnFormSubmit} className="w-full">
            <Label htmlFor="CREATE_TASK_TITLE">Task Title</Label>
            <Input
              type="text"
              name="title"
              id="CREATE_TASK_TITLE"
              placeholder="Enter your task title"
              value={task?.title || ""}
              onChange={handleOnInputChange}
              required
              className="w-full mb-4"
            />
            <Label htmlFor="CREATE_TASK_DESCRIPTION">Task Description</Label>
            <Textarea
              rows={5}
              name="description"
              id="CREATE_TASK_DESCRIPTION"
              placeholder="Enter your task description"
              value={task?.description || ""}
              onChange={handleOnInputChange}
              required
              className="w-full mb-4"
            />
            <Label htmlFor="CREATE_TASK_TODOS">Add to-dos</Label>
            <Input
              type="text"
              name="todo"
              id="CREATE_TASK_TODOS"
              placeholder="Create your to-do"
              onKeyDown={handleOnKeyDown}
              className="w-full mb-2"
            />
            <p className="font-semibold dark:font-medium mb-4">
              Please use "/" key to add the item into the content array.
            </p>
            <ul className="flex flex-col gap-1 mb-10">
              {task?.content?.length ? (
                task?.content?.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between border border-zinc-200 rounded-md p-1 ps-3"
                  >
                    <p className="flex-1 font-medium">
                      {index + 1}. {item?.title || item}
                    </p>
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
            <div className="flex items-center gap-2">
              <Button type="submit" size="large">
                Save Changes
              </Button>
              <Button type="reset" variant="secondary" size="large">
                Reset form
              </Button>
            </div>
          </form>
        </Container>
      </section>
    </main>
  );
};
