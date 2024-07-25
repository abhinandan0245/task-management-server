import { Link, useSearchParams } from "react-router-dom";
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
import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";

export const SignIn = () => {
  const [searchParams] = useSearchParams();

  const [commingFromSignUp, setCommingFromSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const handleShowPassword = (event) => setShowPassword(event.target.checked);

  const handleOnFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await axios.post("/api/user/sign-in", data, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.clear();

      localStorage.setItem("__tmutoken", response?.data?.token);
      localStorage.setItem("__tmuid", response?.data?.user?._id);

      window.location.reload();
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
    }
  };

  const handleSearchParams = () => {
    if (searchParams && searchParams.get("source") === "SIGN_UP_PAGE") {
      const email = searchParams.get("ue");
      const username = searchParams.get("uu");

      setCommingFromSignUp(true);
      setUsername(username);

      emailInputRef.current.value = email;
      passwordInputRef.current.focus();
    }
  };

  useEffect(() => {
    handleSearchParams();
  }, [searchParams]);

  return (
    <main className="h-full overflow-y-auto">
      <section className="pt-16 pb-10">
        <Container>
          {commingFromSignUp && (
            <Card className="max-w-md w-full mb-6 mx-auto">
              <CardBody className="mb-0">
                <p>
                  Congratulations! Your account with{" "}
                  <strong>username: {username}</strong> have successfuly created
                  with Task Management. Please use your password to sign in to
                  your dashboard.
                </p>
              </CardBody>
            </Card>
          )}
          <Card className="max-w-md w-full mx-auto">
            <CardHeader>
              <CardTitle>Login to Task Management!</CardTitle>
              <CardDescription>
                Please use your login credentials to continue
              </CardDescription>
            </CardHeader>
            <CardBody className="mb-6">
              <form onSubmit={handleOnFormSubmit} className="w-full">
                <Label htmlFor="SIGN_IN_EMAIL">Email Address</Label>
                <Input
                  ref={emailInputRef}
                  type="email"
                  name="email"
                  id="SIGN_IN_EMAIL"
                  placeholder="Enter your registered email"
                  required
                  className="w-full mb-4"
                />
                <Label htmlFor="SIGN_IN_PASSWORD">Password</Label>
                <Input
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="SIGN_IN_PASSWORD"
                  placeholder="Enter your password"
                  required
                  className="w-full mb-4"
                />
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    name="showPassword"
                    id="SIGN_IN_SHOW_PASSWORD"
                    checked={showPassword}
                    onChange={handleShowPassword}
                    className="w-4 h-4 accent-zinc-900 dark:accent-white"
                  />
                  <Label htmlFor="SIGN_IN_SHOW_PASSWORD" className="mb-0">
                    {showPassword ? "Hide" : "Show"} password
                  </Label>
                </div>
                <Button
                  type="submit"
                  size="large"
                  className="w-full justify-center"
                >
                  Continue to dashboard
                </Button>
              </form>
              <div className="w-full flex items-center gap-3 my-6">
                <div className="flex-1 h-[0.5px] bg-zinc-200 dark:bg-zinc-700" />
                <p className="text-xs text-zinc-500">Or continue with</p>
                <div className="flex-1 h-[0.5px] bg-zinc-200 dark:bg-zinc-700" />
              </div>
              <p className="font-medium text-center">
                New to Task Management?{" "}
                <Link to="/sign-up/" className="underline">
                  Sign up here.
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
