import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Container } from "../components/ui/container";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const CreateTask = () => {
  const navigate = useNavigate();

  const [contentArray, setContentArray] = useState([]);

  const handleOnKeyDown = (event) => {
    if (event.key === "/" && event.target.value.trim() !== "") {
      setContentArray((prev) => [...prev, event.target.value]);

      setTimeout(() => (event.target.value = ""), 100);
    } else if (
      event.key === "Backspace" &&
      event.target.value === "" &&
      contentArray.length
    ) {
      setTimeout(
        () => (event.target.value = contentArray[contentArray.length - 1]),
        100
      );
      setContentArray(
        contentArray.filter((_, index) => index !== contentArray.length - 1)
      );
    }
  };

  const handleOnFormSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("__tmutoken");

    if (!token) {
      alert("Session expired, please login again to conitnue!");

      localStorage.clear();
      window.location.reload();
    }

    const formData = new FormData(event.target);

    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (!data?.title || !data?.description) {
      alert("Please fill up the required fields to continue!");
      return;
    }

    try {
      const response = await axios.post(
        "/api/task/create",
        { ...data, content: contentArray },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/tasks/details/${response?.data?.task?._id}`);
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
              Create new task
            </h1>
          </div>
          <form onSubmit={handleOnFormSubmit} className="w-full">
            <Label htmlFor="CREATE_TASK_TITLE">Task Title</Label>
            <Input
              type="text"
              name="title"
              id="CREATE_TASK_TITLE"
              placeholder="Enter your task title"
              required
              className="w-full mb-4"
            />
            <Label htmlFor="CREATE_TASK_DESCRIPTION">Task Description</Label>
            <Textarea
              rows={5}
              name="description"
              id="CREATE_TASK_DESCRIPTION"
              placeholder="Enter your task description"
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
              {contentArray.length ? (
                contentArray.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between border border-zinc-200 rounded-md p-1 ps-3"
                  >
                    <p className="flex-1 font-medium">
                      {index + 1}. {item}
                    </p>
                    <Button type="button" variant="ghost" size="icon">
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
                Create task
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
