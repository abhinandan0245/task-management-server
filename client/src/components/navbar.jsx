import { Link } from "react-router-dom";
import { GithubIcon, LogOutIcon } from "lucide-react";

import { Container } from "./ui/container";
import { NavbarSocialLinks } from "../constants";
import { Button, buttonVariants } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "../api/axios";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHomeScreen, setIsHomeScreen] = useState(true);
  const [userDetails, setUserdetails] = useState(null);

  const handleIsLoggedIn = () => {
    const token = localStorage.getItem("__tmutoken");
    const id = localStorage.getItem("__tmuid");

    setIsLoggedIn(token && id);
  };

  useEffect(() => {
    handleIsLoggedIn();
  }, []);

  const handleFetchUserDetails = async () => {
    const token = localStorage.getItem("__tmutoken");

    if (token) {
      try {
        const response = await axios.get("/api/user/details", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response?.data?.user) {
          localStorage.clear();
          window.location.reload();
          return;
        }
        setUserdetails(response?.data?.user);
      } catch (error) {
        alert(error?.response?.data?.message || error?.message);

        localStorage.clear();
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    handleFetchUserDetails();

    return () => abortController.abort();
  }, []);

  const handleIsHomeScreen = () => {
    const isHome = window.location.href === "http://localhost:5173/";
    setIsHomeScreen(isHome);
  };

  useEffect(() => {
    const interval = setInterval(handleIsHomeScreen, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    if (isLoggedIn) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <nav className="border-b border-b-zinc-200 dark:border-b-zinc-800">
      <Container>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-6">
            <Link
              to="/"
              className="text-xl leading-none font-bold dark:font-medium"
            >
              Task Management.
            </Link>
            {isLoggedIn && (
              <div className="inline-flex items-center gap-4">
                <Link
                  to="/tasks/"
                  className="leading-none font-medium dark:font-normal lg:hover:underline mt-1"
                >
                  My Tasks
                </Link>
                <Link
                  to="/tasks/create/"
                  className="leading-none font-medium dark:font-normal lg:hover:underline mt-1"
                >
                  Create Task
                </Link>
                <Link
                  to="/profile/"
                  className="leading-none font-medium dark:font-normal lg:hover:underline mt-1"
                >
                  My Profile
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSignOut}
              >
                <LogOutIcon className="w-4 h-4" />
              </Button>
            ) : isHomeScreen ? (
              <>
                <Link to="/tasks/" className={buttonVariants("outline")}>
                  Dashboard
                </Link>
                <Link to="/sign-up/" className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            ) : null}
            <span className="inline-flex items-center gap-0">
              {NavbarSocialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants("ghost", "icon")}
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </span>
          </div>
        </div>
      </Container>
    </nav>
  );
};
