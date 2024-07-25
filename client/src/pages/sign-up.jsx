import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Container } from "../components/ui/container";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import axios from "../api/axios";

export const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (event) => setShowPassword(event.target.checked);

  const handleOnFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await axios.post("/api/user/sign-up", data, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.clear();

      navigate(
        `/sign-in/?source=SIGN_UP_PAGE&ue=${response?.data?.user?.email}&uu=${response?.data?.user?.username}`
      );
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <main className="h-full overflow-y-auto">
      <section className="pt-16 pb-10">
        <Container>
          <Card className="max-w-md w-full mx-auto">
            <CardHeader>
              <CardTitle>Get started with Task Management!</CardTitle>
              <CardDescription>
                Please use fill out the required fields to continue
              </CardDescription>
            </CardHeader>
            <CardBody className="mb-6">
              <form onSubmit={handleOnFormSubmit} className="w-full">
                <Label htmlFor="SIGN_UP_NAME">Full Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="SIGN_UP_NAME"
                  placeholder="Enter your full name"
                  required
                  className="w-full mb-4"
                />
                <Label htmlFor="SIGN_UP_EMAIL">Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  id="SIGN_UP_EMAIL"
                  placeholder="Enter your email address"
                  required
                  className="w-full mb-4"
                />
                <Label htmlFor="SIGN_UP_USERNAME">Username</Label>
                <Input
                  type="text"
                  name="username"
                  id="SIGN_UP_USERNAME"
                  placeholder="Create your username"
                  required
                  className="w-full mb-4"
                />
                <Label htmlFor="SIGN_UP_PASSWORD">Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="SIGN_UP_PASSWORD"
                  placeholder="Create your password"
                  required
                  className="w-full mb-4"
                />
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    name="showPassword"
                    id="SIGN_UP_SHOW_PASSWORD"
                    checked={showPassword}
                    onChange={handleShowPassword}
                    className="w-4 h-4 accent-zinc-900 dark:accent-white"
                  />
                  <Label htmlFor="SIGN_UP_SHOW_PASSWORD" className="mb-0">
                    Show password
                  </Label>
                </div>
                <Button
                  type="submit"
                  size="large"
                  className="w-full justify-center"
                >
                  Create account with Task Management
                </Button>
              </form>
              <div className="w-full flex items-center gap-3 my-6">
                <div className="flex-1 h-[0.5px] bg-zinc-200 dark:bg-zinc-700" />
                <p className="text-xs text-zinc-500">Or continue with</p>
                <div className="flex-1 h-[0.5px] bg-zinc-200 dark:bg-zinc-700" />
              </div>
              <p className="font-medium text-center">
                Already registered to Task Management?{" "}
                <Link to="/sign-in/" className="underline">
                  Login here.
                </Link>
              </p>
            </CardBody>
            <CardFooter className="justify-center">
              <p className="text-xs text-zinc-500">
                &copy; Copyright 2024 Task Management
              </p>
            </CardFooter>
          </Card>
        </Container>
      </section>
    </main>
  );
};
